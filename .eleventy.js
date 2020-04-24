const fs = require("fs");
const path = require("path");
const markdownItRegex = require('markdown-it-regex').default;
const moment = require('moment');

let manifest = {};
const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");
try {
  manifest = JSON.parse(
    fs.readFileSync(manifestPath, { encoding: "utf8" })
  );
} catch (e) {
  console.log(e);
}


module.exports = function(eleventyConfig) {
  // Layout aliases make templates more portable.
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

  // Adds a universal shortcode to return the URL to a webpack asset. In Nunjack templates:
  // {% webpackAsset 'main.js' %} or {% webpackAsset 'main.css' %}
  eleventyConfig.addShortcode("webpackAsset", function(name) {
    if (!manifest[name]) {
      throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
    }
    return manifest[name];
  });

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  // Copy external dependencies to dist.
  eleventyConfig.addPassthroughCopy({ "src/vendor": "vendor" });

  // Reload the page every time the JS/CSS are changed.
  eleventyConfig.setBrowserSyncConfig({ files: [manifestPath] });

  // A debug utility.
  // eleventyConfig.addFilter("dump", obj => {
//     return util.inspect(obj);
//   });

  eleventyConfig.addFilter("log", obj => {
    console.log(obj);
  });

  eleventyConfig.addFilter("date", timestamp => {
    return moment(timestamp).format('LLL');
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    return (array && array.slice) ? array.slice(0, limit) : array;
  });

  eleventyConfig.addFilter("focus", (discussions, focusID) => {
    const boards = {
      chat: [],
      science: [],
      help: []
    }
    const focusDiscussions = Object.values(discussions).filter(item => item.focus._id === focusID);
    focusDiscussions.forEach(discussion => {
      boards[discussion.board.category].push(discussion);
    });
    return boards;
  });

  eleventyConfig.addFilter("pinned", (discussions, boardID) => {
    return discussions.filter(discussion => discussion.board._id === boardID);
  });

  eleventyConfig.addFilter("featured", (discussions, boardID) => {
    return discussions.filter(discussion => discussion.board._id !== boardID);
  });

  eleventyConfig.addFilter("notFeatured", (discussionIDs, featured) => {
    const featuredIDs = featured.map(discussion => discussion.zooniverse_id);
    return discussionIDs.filter(discussionID => featuredIDs.indexOf(discussionID) === -1);
  });

  // custom tags

  eleventyConfig.addShortcode('avatar', (username, url) => {
    // default to the simple Zoo logo avatar.
    url = url ? url : 'https://static.zooniverse.org/www.zooniverse.org/assets/simple-avatar.jpg';
    // Replace the old default Talk avatar with the new one.
    url = url.endsWith('/default_forum_avatar.png') ? 'https://static.zooniverse.org/www.zooniverse.org/assets/simple-avatar.jpg': url;
    const alt = username;
    // Resize user avatars.
    const src = url.endsWith('simple-avatar.jpg') ? url : `https://thumbnails.zooniverse.org/50x50/${url.slice(8)}`;
    return `<img class="avatar" alt="${alt}" src="${src}" width=20 height=20 />`
  });

  // build collections from tagged subjects.

  function hasTag(item, tag) {
    if (item.tags && item.tags.indexOf(tag) > -1) {
      return true;
    }
    const matchingTags = item.tags && item.tags.filter(itemTag => tag === itemTag._id);
    return matchingTags && matchingTags.length > 0;
  }

  function pageData(collection) {
    const [ item ] = collection.getAll();
    const { subjects, discussions, userCollections } = item.data;
    return { subjects, discussions, userCollections };
  }

  function uniqueTags(items, tags) {
    for (item of items) {
      item.tags && item.tags.forEach(tag => {
        tagName = tag._id || tag;
        tags[tagName] = tag;
      });
    }
    return tags;
  }

  function allUniqueTags(data) {
    let tags = {};
    const { discussions, subjects, userCollections } = data;

    tags = uniqueTags(Object.values(subjects), tags);

    for (discussion of Object.values(discussions)) {
      tags = uniqueTags(discussion.comments, tags);
    }

    tags = uniqueTags(Object.values(userCollections), tags);

    return Object.keys(tags);
  }

  function buildTagCollection(tag, collection, data) {
    const subjects = Object.values(data.subjects).filter(subject => hasTag(subject, tag));
    const discussions = Object.values(data.discussions).filter(discussion => {
      const taggedComments = discussion.comments.filter(comment => hasTag(comment, tag));
      return taggedComments.length > 0;
    });
    const userCollections = Object.values(data.userCollections).filter(userCollection => hasTag(userCollection, tag));
    return { discussions, subjects, userCollections };
  }

  eleventyConfig.addCollection("taggedContent", collection => {
    const taggedItems = {};
    const tagNames = allUniqueTags(pageData(collection));
    for (tag of tagNames) {
      taggedItems[tag] = buildTagCollection(tag, collection, pageData(collection));
    }
    return taggedItems;
  });

  // custom markdown setup
  const markdownIt = require("markdown-it");
  const markdownItEmoji = require("markdown-it-emoji");
  const options = {
    html: true,
    breaks: true,
    linkify: true
  };

  const mentionUsers = {
    name: 'mentionUsers',
    regex: /@(\w+)\b/,
    replace: (match) => {
      const url = `/users/${match}`;
      return `<a href="${url}">@${match}</a>`;
    }
  }

  const mentionTags = {
    name: 'mentionTags',
    regex: /#(\w+)\b/,
    replace: (match) => {
      const url = `/tags/${match.toLowerCase()}`;
      return `<a href="${url}">#${match}</a>`;
    }
  }

  const md = markdownIt(options)
    .use(markdownItEmoji)
    .use(markdownItRegex, mentionUsers)
    .use(markdownItRegex, mentionTags);
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addPairedShortcode("markdown", content => md.render(content.trim()));

  return {
    dir: {
      input: "src/site",
      includes: "_includes", // relative to dir.input
      output: "dist",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
