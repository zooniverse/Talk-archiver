const API = require('../../helpers/api');
const store = require('../../helpers/store');

module.exports = async function fetchUsers() {
  const { discussions } = await store;

  for (discussion of Object.values(discussions)) {
    for (comment of discussion.comments) {
      const { user_name } = comment;
      if (!store.users[user_name]) {
        const user = await API.get(`users/${user_name}`);
        store.users[user_name] = user;
      }
    }
  }

  return store.users;
}