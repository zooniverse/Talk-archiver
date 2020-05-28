const awaitSubjects = require('../../helpers/subjects');

module.exports = async function () {
  const subjects = await awaitSubjects;
  return subjects;
}