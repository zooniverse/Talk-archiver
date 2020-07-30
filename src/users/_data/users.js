const awaitCollections = require('../../helpers/collections');
const awaitUsers = require('../../helpers/users');

module.exports = async function () {
  // fetching all collections will ensure that we have collections stored for all user accounts.
  const collections = await awaitCollections;
  const users = await awaitUsers;
  return users;
}
