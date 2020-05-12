const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchSubjects = require('./subjects');

module.exports = async function fetchCollections() {
  const users = await fetchSubjects();
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
    const owner = store.users[collection.user_name];
    if (owner) {
      owner.my_collections.push(collection);
    }
  });
  return store.userCollections;
}