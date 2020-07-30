const awaitUsers = require('../../helpers/users');

module.exports = async function () {
  const users = await awaitUsers;
  return users;
}
