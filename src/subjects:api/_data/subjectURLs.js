const awaitSubjectURLs = require('../../helpers/subjectURLs');

const args = process.argv.slice(2);
const batch = args[args.length - 2] - 1;

module.exports = async function () {
  const subjectURLs = await awaitSubjectURLs;
  const batchSize = Math.ceil( subjectURLs.length / 10 );
  const start = batch * batchSize;
  const end = start + batchSize;
  console.log('Processing subjects', start, 'to', end);
  return subjectURLs.slice(start, end);
}