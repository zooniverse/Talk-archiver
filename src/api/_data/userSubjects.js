const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchSubjects = require('./subjects');

module.exports = async function fetchUserSubjects() {
  await fetchSubjects();
  const subjectURLs = [];
  for (user of Object.values(store.users)) {
    for (subjectComment of user.subjects) {
      if (!store.subjects[subjectComment.focus.zooniverse_id]) {
        subjectURLs.push(`subjects/${subjectComment.focus.zooniverse_id}`);
      }
    }
  }
  const uniqueURLs = subjectURLs.filter((url, index, self) => self.indexOf(url) === index);
  const subjects = await API.batchedGet(uniqueURLs);
  for (subject of subjects) {
    store.subjects[subject.zooniverse_id] = subject;
  }
  return store.subjects;
}