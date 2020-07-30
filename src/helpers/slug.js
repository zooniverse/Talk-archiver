const slugify = require('slugify');

function slug(string) {
  return slugify(string, { lower: false });
}

module.exports = slug;
