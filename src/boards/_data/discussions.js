const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function fetchDiscussions() {
  console.log('building discussions');
  await awaitBoards;
  const { discussions } = store;
  return discussions;
}