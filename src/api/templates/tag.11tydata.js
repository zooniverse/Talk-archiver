const awaitTags = require('../../helpers/tags');

module.exports = async function() {
  const userTags = await awaitTags;
  return { userTags };
}
