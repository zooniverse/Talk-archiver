const awaitUsers = require('../../helpers/users');

const args = process.argv.slice(2);
const batch = args[args.length - 2] - 1;

const start = batch * 5000;
const end = start + 5000;

module.exports = async function () {
  const users = await awaitUsers;
  console.log('Processing users', start, 'to', end);
  const usersArray = Object.values(users).slice(start, end);
  return usersArray;
}
