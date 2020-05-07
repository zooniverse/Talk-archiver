const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUsers = require('./users');

module.exports = async function fetchCollections() {
  const users = await fetchUsers();
  const collectionURLs = [];
  for (user of Object.values(users)) {
    for (collection of user.my_collections) {
      if (!store.userCollections[collection.zooniverse_id]) {
        collectionURLs.push(`collections/${collection.zooniverse_id}`);
      }
    }
  }

  const userCollections = await API.batchedGet(collectionURLs);
  for (userCollection of userCollections) {
    if (!store.userCollections[userCollection.zooniverse_id]) {
      store.userCollections[userCollection.zooniverse_id] = userCollection;
    }
  }
  return store.userCollections;
}