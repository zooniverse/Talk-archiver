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
  })

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
