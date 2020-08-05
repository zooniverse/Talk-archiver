const awaitSubjectURLs = require('../../helpers/subjectURLs');

const args = process.argv.slice(2);
const batch = args[args.length - 2] - 1;

const start = batch * 28000;
const end = start + 28000;

module.exports = async function () {
  const subjectURLs = await awaitSubjectURLs;
  console.log('Processing subjects', start, 'to', end);
  return subjectURLs.slice(start, end);
}