const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUsers = require('./users');

module.exports = async function fetchCollections() {
  const users = await fetchUsers();
  for (user of Object.values(users)) {
    try {
      for (collection of user.my_collections) {
        if (!store.userCollections[collection.zooniverse_id]) {
          const userCollection = await API.get(`collections/${collection.zooniverse_id}`)
          store.userCollections[collection.zooniverse_id] = userCollection;
          for (subject of userCollection.subjects) {
            if (!store.subjects[subject.zooniverse_id]) {
              const fullSubject = await API.get(`subjects/${subject.zooniverse_id}`)
              store.subjects[subject.zooniverse_id] = fullSubject;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return store.userCollections;
}