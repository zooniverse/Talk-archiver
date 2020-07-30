const awaitSubjectURLs = require('../../helpers/subjectURLs');

module.exports = async function () {
  const subjectURLs = await awaitSubjectURLs;
  return subjectURLs;
}