const awaitCollections = require('../../helpers/collections');
const awaitSubjects = require('../../helpers/subjects');
const awaitTags = require('../../helpers/tags');

module.exports = async function() {
  const userTags = await awaitTags;
  const [ userCollections, subjects ] = await Promise.all([awaitCollections, awaitSubjects]);
  return { subjects, userCollections, userTags };
}
