const CacheAsset = require("@11ty/eleventy-cache-assets");

async function fetchProject(name) {
  return await CacheAsset(`https://www.penguinwatch.org/_ouroboros_api/projects/${name}`, {
    	duration: "30d",
    	type: "json"
  });
}

module.exports = fetchProject;
