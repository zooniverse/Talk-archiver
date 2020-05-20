const tags = require('../../helpers/tags');
const userCollections = require('./userCollections');

module.exports = async function() {
  await userCollections();
  return tags();
}
