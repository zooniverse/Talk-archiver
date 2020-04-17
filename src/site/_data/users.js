const API = require('../../helpers/api');
const store = require('../../helpers/store');


async function fetchPage(name, page) {
  const data = await API.get(`users/${name}?type=my_collections&page=${page}`);
  return data;
}

async function listCollections(user) {
  let userCollections = [];
  for (let page = 2; page <= 100; page++) {
    const { my_collections } = await fetchPage(user.name, page);
    if (my_collections.length === 0) {
      return userCollections
    }
    userCollections = userCollections.concat(my_collections);
  }
  return userCollections
}

module.exports = async function fetchUsers() {
  const { discussions } = await store;

  for (discussion of Object.values(discussions)) {
    for (comment of discussion.comments) {
      const { user_name } = comment;
      if (!store.users[user_name]) {
        const user = await API.get(`users/${user_name}`);
        const userCollections = await listCollections(user);
        user.my_collections.push(...userCollections);
        store.users[user_name] = user;
      }
    }
  }

  return store.users;
}