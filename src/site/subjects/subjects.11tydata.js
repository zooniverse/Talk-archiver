const awaitSubjects = require('../../helpers/subjects');
const store = require('../../helpers/store');

module.exports = async function () {
  const subjects = await awaitSubjects;
  const { discussions } = store;
  return { discussions, subjects };
}