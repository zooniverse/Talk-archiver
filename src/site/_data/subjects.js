const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUserCollections = require('./userCollections');

async function fetchPage(name, page) {
  const data = await API.get(`users/${name}?type=my_collections&page=${page}`);
  return data;
}

async function listCollections(user_name) {
  let userCollections = [];
  for (let page = 2; page <= 100; page++) {
    const { my_collections } = await fetchPage(user_name, page);
    if (my_collections.length === 0) {
      return userCollections
    }
    userCollections = userCollections.concat(my_collections);
  }
  return userCollections
}

async function subjectUsers(discussion) {
  for (comment of discussion.comments) {
    const { user_name } = comment;
    if (!store.users[user_name]) {
      const user = await API.get(`users/${user_name}`);
      const userCollections = await listCollections(user_name);
      user.my_collections && user.my_collections.push(...userCollections);
      store.users[user_name] = user;
    }
  }
}

module.exports = async function fetchSubjects() {
  const collections = await fetchUserCollections();

  for (collection of Object.values(collections)) {
    for (subject of collection.subjects) {
      if (!store.subjects[subject.zooniverse_id]) {
        const fullSubject = await API.get(`subjects/${subject.zooniverse_id}`)
        await subjectUsers(fullSubject.discussion);
        store.subjects[subject.zooniverse_id] = fullSubject;
      }
    }
  }

  return store.subjects;
}