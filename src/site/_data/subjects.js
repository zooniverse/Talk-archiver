const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUserCollections = require('./userCollections');

module.exports = async function fetchSubjects() {
  const collections = await fetchUserCollections();

  for (collection of Object.values(collections)) {
    for (subject of collection.subjects) {
      if (!store.subjects[subject.zooniverse_id]) {
        const fullSubject = await API.get(`subjects/${subject.zooniverse_id}`)
        store.subjects[subject.zooniverse_id] = fullSubject;
      }
    }
  }

  return store.subjects;
}