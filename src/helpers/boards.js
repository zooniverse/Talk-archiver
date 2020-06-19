const API = require('./api');
const fetchBoard = require('./fetchBoard');
const store = require('./store');

const CATEGORIES = [
  'chat',
  'help',
  'science'
]
async function discussionBoard(board) {
  if ( board.zooniverse_id && board.discussions ) {
    const { boards } = store;
    const discussionsCount = board.discussions_count || board.discussions;
    const pages = Math.ceil(discussionsCount / 10) || 1
    const fullBoard = await fetchBoard(board, pages);
    boards[fullBoard.category] = boards[fullBoard.category] || {};
    boards[fullBoard.category][board.zooniverse_id] = fullBoard;
  }
  return board;
}

async function fetchBoards() {
  const boards = await API.get('boards/');
  let boardCount = 0;
  for (category of CATEGORIES) {
    const categoryBoards = await Promise.all(boards[category].map(discussionBoard));
    boards[category] = categoryBoards;
    boardCount = boardCount + categoryBoards.length;
  }
  store.boards.featured = boards.featured;
  store.boards.tags = boards.tags;
  console.log('loaded', boardCount, 'boards');
  const discussionCount = Object.values(store.discussions).length;
  console.log('loaded', discussionCount, 'discussions');
  return store.boards;
}

module.exports = fetchBoards();

