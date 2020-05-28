const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function () {
  console.log('building boards');
  const boards = await awaitBoards;
  const { discussions } = store;
  return { boards, discussions };
}
