const awaitBoards = require('../../helpers/boards');
const awaitCollections = require('../../helpers/collections');
const awaitSubjects = require('../../helpers/subjects');
const awaitTags = require('../../helpers/tags');
const store = require('../../helpers/store');

module.exports = async function() {
  await awaitBoards;
  const userTags = await awaitTags;
  const [ userCollections, subjects ] = await Promise.all([awaitCollections, awaitSubjects]);
  const { discussions } = store;
  return { discussions, subjects, userCollections, userTags };
}
