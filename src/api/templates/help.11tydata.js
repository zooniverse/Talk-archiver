const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function () {
  console.log('building help boards');
  const { help } = await awaitBoards;
  return { help };
}
