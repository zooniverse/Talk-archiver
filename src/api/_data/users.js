const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const API = require('../../helpers/api');
const store = require('../../helpers/store');

const userURLs = [];


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

function parseRow({ ouroboros_user_id }) {
  const userURL = `users/${ouroboros_user_id}`;
  userURLs.push(userURL);
}

module.exports = async function fetchUsers() {
  const parseData = new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../../.data', 'illustratedlife_user_ids.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', parseRow)
      .on('end', (rowCount) => {
        resolve(userURLs);
        console.log(`Parsed ${rowCount} users`)
      });
  })

  const urls = await parseData;
  const users = await API.batchedGet(urls);

  for (user of users) {
    if (user.name) {
      const userCollections = await listCollections(user);
      const userSubjects = await listSubjects(user);
      user.my_collections && user.my_collections.push(...userCollections);
      user.subjects && user.subjects.push(...userSubjects);
      store.users[user.name] = user;
    }
  }

  return store.users;
}

