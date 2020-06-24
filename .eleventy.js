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

  const slug = require('./src/helpers/slug');

  eleventyConfig.addFilter("slug", string => {
    const safeString = slug(string);
    return safeString || string;
  });

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

  eleventyConfig.addShortcode('avatar', require('./src/components/avatar'));
  eleventyConfig.addShortcode('collectionSummary', require('./src/components/collectionSummary'));
  eleventyConfig.addAsyncShortcode('discussionComment', require('./src/components/discussionComment'));
  eleventyConfig.addShortcode('discussionSummary', require('./src/components/discussionSummary'));
  eleventyConfig.addShortcode('featuredDiscussions', require('./src/components/featuredDiscussions'));
  eleventyConfig.addPairedAsyncShortcode("markdown", require('./src/components/markdown'));
  eleventyConfig.addAsyncShortcode('pageHeader', require('./src/components/pageHeader'));
  eleventyConfig.addAsyncShortcode('pageMetadata', require('./src/components/pageMetadata'));
  eleventyConfig.addShortcode('subjectImage', require('./src/components/subjectImage'));
  eleventyConfig.addShortcode('tags', require('./src/components/tagList'));

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
