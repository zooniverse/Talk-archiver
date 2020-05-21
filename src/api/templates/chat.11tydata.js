const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function () {
  console.log('building chat boards');
  const { chat } = await awaitBoards;
  return { chat };
}
