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

async function fetchUsers() {
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

  const users = {};
  const urls = await parseData;
  const APIusers = await API.batchedGet(urls);

  for (user of APIusers) {
    if (user.name) {
      if (user.url !== `users/${user.id}`) {
        throw new Error(`User mismatch: ${user.url} ${user.name}`);
      }
      // remove the domain from email addresses in usernames.
      user.name = user.name.split('@');
      user.name = user.name[0];
      user.subjects = [];
      users[`${user.name}`] = user;
    }
  }

  const { subjects } = await discussionComments;
  for (subjectDiscussion of subjects ) {
    for (comment of subjectDiscussion.comments) {
      const author = users[comment.user_name];
      const focus = {
        location: subjectDiscussion.focus.location,
        zooniverse_id: subjectDiscussion.focus._id
      };
      if (author) {
        author.subjects.push({ comment, focus });
      }
    }
  }

  for (user of Object.values(users)) {
    user.subjects.sort(function sortSubjectComments(subject1, subject2) {
      const date1 = new Date(subject1.comment.created_at);
      const date2 = new Date(subject2.comment.created_at);
      return date2 - date1;
    });
  }

  console.log('loaded', Object.keys(users).length, 'users');
  return users;
}

module.exports = fetchUsers();


