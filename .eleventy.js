const fs = require("fs");
const path = require("path");
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
    return array.slice(0, limit);
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

  function uniqueTags(data) {
    const tags = {};
    const { discussions, subjects, userCollections } = data;

    for (subject of Object.values(subjects)) {
      subject.tags && subject.tags.forEach(tag => {
        tags[tag._id] = tag;
      });
    }

    for (discussion of Object.values(discussions)) {
      discussion.comments.forEach(comment => {
        comment.tags && comment.tags.forEach(tag => {
          tags[tag] = tag;
        });
      })
    }

    for (userCollection of Object.values(userCollections)) {
      userCollection.tags && userCollection.tags.forEach(tag => {
        tags[tag] = tag;
      })
    }

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
    const tagNames = uniqueTags(pageData(collection));
    for (tag of tagNames) {
      taggedItems[tag] = buildTagCollection(tag, collection, pageData(collection));
    }
    return taggedItems;
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
