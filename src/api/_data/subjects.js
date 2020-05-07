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
  const userURLs = discussion.comments
    .filter(comment => !store.users[comment.user_name])
    .map(comment => `users/${comment.user_name}`);
  const users = await API.batchedGet(userURLs);

  for (user of users) {
    if (!store.users[user.name]) {
      if (user.name) {
        const userCollections = await listCollections(user.name);
        user.my_collections && user.my_collections.push(...userCollections);
        store.users[user.name] = user;
        for (collection of user.my_collections) {
          if (!store.userCollections[collection.zooniverse_id]) {
            const userCollection = await API.get(`collections/${collection.zooniverse_id}`)
            store.userCollections[collection.zooniverse_id] = userCollection;
          }
        }
      } else {
        console.log(`*** Invalid response for user ${user.name}`)
      }
    }
  }
}

async function collectionSubjects(collection) {
  const subjectURLs = collection.subjects
    .filter(subject => !store.subjects[subject.zooniverse_id])
    .map(subject => `subjects/${subject.zooniverse_id}`);
  const fullSubjects = await API.batchedGet(subjectURLs);

  for (fullSubject of fullSubjects) {
    if (!store.subjects[fullSubject.zooniverse_id]) {
      await subjectUsers(fullSubject.discussion);
      store.subjects[fullSubject.zooniverse_id] = fullSubject;
    }
  }
}

module.exports = async function fetchSubjects() {
  const collections = await fetchUserCollections();

  for (collection of Object.values(collections)) {
    await collectionSubjects(collection);
  }

  for (collection of Object.values(store.userCollections)) {
    await collectionSubjects(collection);
  }

  return store.subjects;
}