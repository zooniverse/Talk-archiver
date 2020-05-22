const awaitTags = require('../../helpers/tags');
const store = require('../../helpers/store');

module.exports = async function() {
  const userTags = await awaitTags;
  const { userCollections, discussions, subjects } = store;
  return { discussions, subjects, userCollections, userTags };
}
