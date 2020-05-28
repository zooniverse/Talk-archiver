const fs = require('fs');
const path = require('path');
const readline = require('readline');

const project = require('./project');
const discussionComments = require('./discussionComments');
const awaitUsers = require('./users');

function discussionTags(comments) {
  let allTags = [];
  for (comment of comments) {
    const { tags } = comment;
    allTags = allTags.concat(tags);
  }
  return allTags;
}

async function fetchCollections() {
  const userCollections = {};
  const { name } = await project;
  const users = await awaitUsers;
  const collections = [];

  const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, '../../.data', `${name}_collections.json`)),
      output: process.stdout,
      terminal: false
  });

  rl.on('line', (line) => {
    const collection = JSON.parse(line);
    collection.discussion = {};
    collection.tags = [];
    // console.log('Read collection', collection.zooniverse_id);
    userCollections[collection.zooniverse_id] = collection;
    const owner = users[collection.user_id];
    const collectionExists = owner && owner.my_collections.find(userCollection => userCollection.zooniverse_id === collection.zooniverse_id);
    if (owner && !collectionExists) {
      owner.my_collections.push(collection);
    }
  });

  return new Promise((resolve, reject) => {
    rl.on('close', async () => {
      const { collections } = await discussionComments;
      for (discussion of collections) {
        const collection = userCollections[discussion.focus._id];
        collection.discussion = discussion;
        collection.tags = discussionTags(discussion.comments);
      }
      console.log('read', Object.keys(userCollections).length, 'collections');
      resolve(userCollections);
    });
  });
}

module.exports = fetchCollections();
