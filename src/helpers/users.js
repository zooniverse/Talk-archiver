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
        console.log(`Parsed ${rowCount} users`)
      });
  })

  const users = {};
  const urls = await parseData;
  const APIusers = await API.batchedGet(urls);

  for (user of APIusers) {
    if (user.name) {
      users[user.id] = user;
    }
  }

  const { subjects } = await discussionComments;
  for (subjectDiscussion of subjects ) {
    for (comment of subjectDiscussion.comments) {
      const author = users[comment.user_id];
      const focus = {
        location: subjectDiscussion.focus.location,
        zooniverse_id: subjectDiscussion.focus._id
      };
      const commentExists = author && author.subjects.find(userSubject => userSubject.comment._id === comment._id);
      if (author && !commentExists) {
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

  return users;
}

module.exports = fetchUsers();


