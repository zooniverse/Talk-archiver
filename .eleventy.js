const fs = require("fs");
const path = require("path");
const moment = require('moment');
const config = require('./src/config');

let manifest = {};
const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");
try {
  manifest = JSON.parse(
    fs.readFileSync(manifestPath, { encoding: "utf8" })
  );
} catch (e) {
  console.log(e);
}

const PREFIX = config.project.prefix;

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

  // Copy API data files to dist.
  eleventyConfig.addPassthroughCopy({ "src/site/_data": "api" });

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

  eleventyConfig.addFilter('mapKeys', (keys, object) => {
    return keys.map(key => object[key]);
  });

  // custom tags

  eleventyConfig.addShortcode('avatar', require('./src/site/components/avatar'));
  eleventyConfig.addShortcode('featuredDiscussions', require('./src/site/components/featuredDiscussions'));
  eleventyConfig.addShortcode('tags', require('./src/site/components/tagList'));

  // custom markdown setup
  const markdownIt = require("markdown-it");
  const markdownItEmoji = require("markdown-it-emoji");
  const markdownItRegex = require('markdown-it-regex').default;
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

  const subjectRegex = new RegExp(`\\b(?<!\\/)(A${PREFIX}\\w+)(?!\\])\\b`);
  const collectionRegex = new RegExp(`\\b(?<!\\/)(C${PREFIX}\\w+)(?!\\])\\b`);

  const mentionSubjects = {
    name: 'mentionSubjects',
    // match any subject ID that doesn't begin with / or end in ]
    regex: subjectRegex,
    replace: (match) => {
      const url = `/subjects/${match}`;
      return `<a href="${url}">${match}</a>`;
    }
  }

  const mentionCollections = {
    name: 'mentionCollections',
    regex: collectionRegex,
    replace: (match) => {
      const url = `/collections/${match}`;
      return `<a href="${url}">${match}</a>`;
    }
  }

  const md = markdownIt(options)
    .use(markdownItEmoji)
    .use(markdownItRegex, mentionUsers)
    .use(markdownItRegex, mentionTags)
    .use(markdownItRegex, mentionSubjects)
    .use(markdownItRegex, mentionCollections);
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addPairedShortcode("markdown", content => {
    return md.render(content.trim());
  });

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
