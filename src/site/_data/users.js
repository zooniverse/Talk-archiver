const API = require('../../helpers/api');
const store = require('../../helpers/store');


async function fetchCollectionsPage(name, page) {
  const data = await API.get(`users/${name}?type=my_collections&page=${page}`);
  return data;
}

async function fetchSubjectsPage(name, page) {
  const data = await API.get(`users/${name}?type=subjects&page=${page}`);
  return data;
}

async function listCollections(user) {
  let userCollections = [];
  for (let page = 2; page <= 100; page++) {
    const { my_collections } = await fetchCollectionsPage(user.name, page);
    if (my_collections.length === 0) {
      return userCollections
    }
    userCollections = userCollections.concat(my_collections);
  }
  return userCollections
}

async function listSubjects(user) {
  let userSubjects = [];
  for (let page = 2; page <= 1000; page++) {
    const { subjects } = await fetchSubjectsPage(user.name, page);
    if (subjects.length === 0) {
      return userSubjects
    }
    userSubjects = userSubjects.concat(subjects);
  }
  return userSubjects
}

module.exports = async function fetchUsers() {
  const { discussions } = await store;

  for (discussion of Object.values(discussions)) {
    for (comment of discussion.comments) {
      const { user_name } = comment;
      if (!store.users[user_name]) {
        const user = await API.get(`users/${user_name}`);
        const userCollections = await listCollections(user);
        const userSubjects = await listSubjects(user);
        user.my_collections && user.my_collections.push(...userCollections);
        user.subjects && user.subjects.push(...userSubjects)
        store.users[user_name] = user;
      }
    }
  }

  return store.users;
}