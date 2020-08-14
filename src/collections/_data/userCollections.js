const awaitCollections = require('../../helpers/collections');

const args = process.argv.slice(2);
const batch = args[args.length - 2] - 1;

module.exports = async function () {
  const userCollections = await awaitCollections;
  const collectionsArray = Object.values(userCollections);
  const batchSize = Math.ceil( collectionsArray.length / 10);
  const start = batch * batchSize;
  const end = start + batchSize;
  console.log('Processing collections', start, 'to', end);
  return collectionsArray.slice(start, end);
}