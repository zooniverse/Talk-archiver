const API = require('../../helpers/api');
const store = require('../../helpers/store');


async function fetchCollectionsPage(name, page) {
  const data = await API.get(`users/${name}?type=my_collections&page=${page}`);
  return data;
}

async function fetchSubjectsPage(name, page) {
  const data = API.get(`users/${name}?type=subjects&page=${page}`);
  return data;
}

async function fetchBatchedSubjects(user, start, end) {
  const promises = [];
  for (let page = start; page < end; page++) {
    promises.push(fetchSubjectsPage(user.name, page))
  }
  const pages = await Promise.all(promises);
  return pages
    .map(page => page.subjects)
    .filter(page => page.length > 0);
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
  const batchSize = 10;
  for (let page = 2; page <= 1000; page = page + batchSize) {
    const pages = await fetchBatchedSubjects(user, page, page + batchSize);
    for (subjectPage of pages) {
      userSubjects = userSubjects.concat(subjectPage);
    }
    if (pages.length < batchSize) {
      return userSubjects;
    }
  }
  return userSubjects
}

module.exports = async function fetchUsers() {
  const { discussions } = await store;
  const userURLs = [];

  for (discussion of Object.values(discussions)) {
    for (comment of discussion.comments) {
      const { user_name } = comment;
      const userURL = `users/${user_name}`;
      if (!store.users[user_name]) {
        userURLs.push(`users/${user_name}`);
      }
    }
  }

  const users = await API.batchedGet(userURLs);
  for (user of users) {
    if (user.name) {
      const userCollections = await listCollections(user);
      const userSubjects = await listSubjects(user);
      user.my_collections && user.my_collections.push(...userCollections);
      user.subjects && user.subjects.push(...userSubjects)
      store.users[user.name] = user;
    } else {
      console.log(`*** Invalid response for user ${user_name}`);
    }
  }

  return store.users;
}