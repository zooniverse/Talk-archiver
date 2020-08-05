const awaitCollections = require('../../helpers/collections');
const awaitUsers = require('../../helpers/users');

const args = process.argv.slice(2);
const batch = args[args.length - 2] - 1;

module.exports = async function () {
  // fetching all collections will ensure that we have collections stored for all user accounts.
  const collections = await awaitCollections;
  const users = await awaitUsers;
  const usersArray = Object.values(users);
  const batchSize = Math.ceil( usersArray.length / 10);
  const start = batch * batchSize;
  const end = start + batchSize;
  console.log('Processing users', start, 'to', end);
  return usersArray.slice(start, end);
}
