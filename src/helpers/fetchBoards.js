const fetch = require('node-fetch');
const fetchBoard = require('./fetchBoard');

const HOST = 'https://www.penguinwatch.org'
const PROJECT = 'illustratedlife'

const CATEGORIES = [
  'chat',
  'help',
  'science'
]
async function discussionBoard(board) {
  if ( board.zooniverse_id && board.discussions ) {
    const pages = Math.ceil(board.discussions / 10) || 1
    const fullBoard = await fetchBoard(HOST, PROJECT, board, pages);
    console.log('board discussions', board.zooniverse_id, board.discussions.length)
    return fullBoard
  }
  return board;
}

module.exports = async function fetchBoards() {
  const response = await fetch(
      `${HOST}/_ouroboros_api/projects/${PROJECT}/talk/boards`,
    {
      headers: { Accept: "application/json" }
    }
  );
  const boards = await response.json();
  for (category of CATEGORIES) {
    console.log(category)
    const categoryBoards = await Promise.all(boards[category].map(discussionBoard));
    boards[category] = categoryBoards;
  }
  return boards;
}
