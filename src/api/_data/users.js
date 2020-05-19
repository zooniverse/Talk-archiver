const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const project = require('../../helpers/project');
const API = require('../../helpers/api');
const store = require('../../helpers/store');

const userURLs = [];

function parseRow({ ouroboros_user_id }) {
  const userURL = `users/${ouroboros_user_id}`;
  userURLs.push(userURL);
}

module.exports = async function fetchUsers() {
  const { name } = await project;
  if (Object.keys(store.users).length === 0) {
    const parseData = new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(__dirname, '../../../.data', `${name}_user_ids.csv`))
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
        store.users[user.name] = user;
      }
    }
  }

  return store.users;
}

