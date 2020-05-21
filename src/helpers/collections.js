const fs = require('fs');
const path = require('path');
const readline = require('readline');

const project = require('./project');
const store = require('./store');
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
  if (Object.keys(store.userCollections).length === 0) {
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
      console.log('Read collection', collection.zooniverse_id);
      store.userCollections[collection.zooniverse_id] = collection;
      const owner = users[collection.user_name];
      const collectionExists = owner && owner.my_collections.find(userCollection => userCollection.zooniverse_id === collection.zooniverse_id);
      if (owner && !collectionExists) {
        owner.my_collections.push(collection);
      }
    });

    return new Promise((resolve, reject) => {
      rl.on('close', async () => {
        const { collections } = await discussionComments;
        for (discussion of collections) {
          const collection = store.userCollections[discussion.focus._id];
          collection.discussion = discussion;
          collection.tags = discussionTags(discussion.comments);
        }
        resolve(store.userCollections);
      });
    });
  }

  return store.collections;
}

module.exports = fetchCollections();
