const fetchBoards = require('../../helpers/fetchBoards');
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
  const boards = await fetchBoards();
  let discussions = []
  for ( category of CATEGORIES ) {
    const boardDiscussions = boards[category].forEach( function (board) {
      discussions = discussions.concat(board.discussions);
    });
  }
  console.log('Built discussions', discussions.length)
  console.log('DISCUSSIONS', discussions.map(logDiscussion))
  return discussions.filter(filterDiscussions);
}