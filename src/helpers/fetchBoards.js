const API = require('./api');
const fetchBoard = require('./fetchBoard');

const CATEGORIES = [
  'chat',
  'help',
  'science'
]
async function discussionBoard(board) {
  if ( board.zooniverse_id && board.discussions ) {
    const discussionsCount = board.discussions_count || board.discussions;
    const pages = Math.ceil(discussionsCount / 10) || 1
    const fullBoard = await fetchBoard(board, pages);
    console.log('board discussions', board.zooniverse_id, discussionsCount)
    return fullBoard
  }
  return board;
}

module.exports = async function fetchBoards() {
  const boards = await API.get('boards/');
  for (category of CATEGORIES) {
    console.log(category)
    const categoryBoards = await Promise.all(boards[category].map(discussionBoard));
    boards[category] = categoryBoards;
  }
  return boards;
}
