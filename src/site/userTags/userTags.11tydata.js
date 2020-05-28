const awaitBoards = require('../../helpers/boards');
const awaitCollections = require('../../helpers/collections');
const awaitSubjects = require('../../helpers/subjects');
const awaitTags = require('../../helpers/tags');
const discussionComments = require('../../helpers/discussionComments');

module.exports = async function() {
  const { boards } = await discussionComments;
  const userTags = await awaitTags;
  const [ userCollections, subjects ] = await Promise.all([awaitCollections, awaitSubjects]);
  const discussions = {};
  for (boardDiscussion of boards) {
    discussions[boardDiscussion.zooniverse_id] = boardDiscussion;
  }
  return { discussions, subjects, userCollections, userTags };
}
