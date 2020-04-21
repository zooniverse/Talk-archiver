const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchSubjects = require('./subjects');

module.exports = async function fetchUserSubjects() {
  const subjects = await fetchSubjects();
  for (user of Object.values(store.users)) {
    try {
      for (subjectComment of user.subjects) {
        if (!store.subjects[subjectComment.focus.zooniverse_id]) {
          const subject = await API.get(`subjects/${subjectComment.focus.zooniverse_id}`)
          store.subjects[subject.zooniverse_id] = subject;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return store.subjects;
}