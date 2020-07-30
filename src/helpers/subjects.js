const API = require('./api');
const subjectURLs = require('./subjectURLs');

async function fetchSubjects() {
  const urls = await subjectURLs;
  const APIsubjects = await API.batchedGet(urls);
  const subjects = {};

  for (subject of APIsubjects) {
    if (subject && subject.url !== `subjects/${subject.zooniverse_id}`) {
      console.error(`Subject mismatch: ${subject.url} ${subject.zooniverse_id}`);
    } else {
      subjects[subject.zooniverse_id] = subject;
    }
  }

  console.log('loaded', Object.keys(subjects).length, 'subjects');
  return subjects;
}

module.exports = fetchSubjects();


