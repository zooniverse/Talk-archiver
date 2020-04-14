const fetchBoards = require('../../helpers/fetchBoards');
const store = require('../../helpers/store');

module.exports = async function () {
  console.log('building boards');
  await fetchBoards();
  return store.boards;
}
