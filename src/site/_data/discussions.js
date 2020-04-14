const fetchBoards = require('../../helpers/fetchBoards');
const store = require('../../helpers/store');

const CATEGORIES = [
  'chat',
  'help',
  'science'
]

function logDiscussion(discussion) {
  return `/boards/${discussion.board && discussion.board._id}/discussions/${discussion.zooniverse_id}/`
}

function filterDiscussions(discussion) {
  return discussion.board && discussion.board._id
}

module.exports = async function fetchDiscussions() {
  console.log('building discussions');
  await fetchBoards();
  const { discussions } = store;
  console.log('Built discussions', Object.keys(discussions).length)
  console.log('DISCUSSIONS', Object.values(discussions).map(logDiscussion))
  return Object.values(discussions).filter(filterDiscussions);
}