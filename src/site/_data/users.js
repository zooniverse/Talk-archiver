const store = require('../../helpers/store');

module.exports = async function fetchUsers() {
  const { users } = await store;
  return users;
}