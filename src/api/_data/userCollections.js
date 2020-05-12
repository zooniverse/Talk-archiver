const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUsers = require('./users');

module.exports = async function fetchCollections() {
  const users = await fetchUsers();
  const collections = [];

  const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, '../../../.data', 'illustratedlife_collections.json')),
      output: process.stdout,
      terminal: false
  });

  rl.on('line', (line) => {
    const collection = JSON.parse(line);
    console.log('Read collection', collection.zooniverse_id);
    store.userCollections[collection.zooniverse_id] = collection;
    const owner = users[collection.user_name];
    if (owner && owner.my_collections.indexOf(collection) === -1) {
      owner.my_collections.push(collection);
    }
  });
  return store.userCollections;
}