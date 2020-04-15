const store = require('../../helpers/store');

module.exports = async function fetchSubjects() {
  const { subjects } = await store;
  return subjects;
}