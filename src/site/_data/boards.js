const fetchBoards = require('../../helpers/fetchBoards');

module.exports = async function () {
  console.log('building boards');
  const boards = await fetchBoards();
  return boards;
}
