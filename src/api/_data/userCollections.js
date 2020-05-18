const fs = require('fs');
const path = require('path');
const readline = require('readline');

const store = require('../../helpers/store');
const discussionComments = require('../../helpers/discussionComments');
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
    const collectionExists = owner && owner.my_collections.find(userCollection => userCollection.zooniverse_id === collection.zooniverse_id);
    if (owner && !collectionExists) {
      owner.my_collections.push(collection);
    }
  });

  rl.on('close', async () => {
    const { collections } = await discussionComments;
    for (discussion of collections) {
      const collection = store.userCollections[discussion.focus._id];
      collection.discussion = discussion;
    }
  })

  return store.userCollections;
}