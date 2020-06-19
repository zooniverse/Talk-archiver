const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function () {
  const boards = await awaitBoards;
  return boards;
}
