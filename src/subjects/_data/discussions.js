const discussionComments = require('../../helpers/discussionComments');

module.exports = async function () {
  const { boards } = await discussionComments;
  const discussions = {};
  for (boardDiscussion of boards) {
    discussions[boardDiscussion.zooniverse_id] = boardDiscussion;
  }
  return discussions;
}