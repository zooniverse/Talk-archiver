const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const project = require('./project');
const API = require('./api');
const discussionComments = require('./discussionComments');

const userURLs = [];

function parseRow({ ouroboros_user_id }) {
  const userURL = `users/${ouroboros_user_id}`;
  userURLs.push(userURL);
}

async function fetchAvatars() {
  const { name } = await project;
  const parseData = new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../.data', `${name}_user_ids.csv`))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', parseRow)
      .on('end', (rowCount) => {
        resolve(userURLs);
        console.log('read', rowCount, 'users');
      });
  })

  const avatars = {};
  const urls = await parseData;
  const APIusers = await API.batchedGet(urls);

  for (user of APIusers) {
    if (user.name) {
      if (user.url !== `users/${user.id}`) {
        throw new Error(`User mismatch: ${user.url} ${user.name}`);
      }
      avatars[user.id] = user.avatar_url;
    }
  }

  console.log('loaded', Object.keys(avatars).length, 'avatars');
  return avatars;
}

module.exports = fetchAvatars();


