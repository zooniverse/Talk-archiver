const slugify = require('slugify');

function slug(string) {
  return slugify(string, { lower: true });
}

module.exports = slug;
