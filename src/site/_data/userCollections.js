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
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return store.userCollections;
}