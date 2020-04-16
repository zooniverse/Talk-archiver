const store = require('../../helpers/store');

module.exports = async function fetchSubjects() {
  const { users } = await store;
  return users;
}