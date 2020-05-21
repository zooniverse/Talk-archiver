const awaitBoards = require('../../helpers/boards');
const store = require('../../helpers/store');

module.exports = async function () {
  console.log('building science boards');
  const { science } = await awaitBoards;
  return { science };
}
