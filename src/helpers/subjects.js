const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const API = require('./api');
const project = require('./project');
const store = require('./store');
const awaitUsers = require('./users');

const subjectURLs = [];

function parseRow({ ouroboros_subject_id }) {
  const subjectURL = `subjects/${ouroboros_subject_id}`;
  subjectURLs.push(subjectURL);
}

async function fetchSubjects() {
  const { name } = await project;
  const users = await awaitUsers;

  const parseData = new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../.data', `${name}_subject_ids.csv`))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', parseRow)
      .on('end', (rowCount) => {
        resolve(subjectURLs);
        console.log(`Parsed ${rowCount} subjects`)
      });
  })

  const urls = await parseData;
  const subjects = await API.batchedGet(urls);

  for (subject of subjects) {
    store.subjects[subject.zooniverse_id] = subject;
    for (comment of subject.discussion.comments) {
      const author = store.users[comment.user_name];
      const focus = {
        location: subject.location,
        zooniverse_id: subject.zooniverse_id
      }
      const commentExists = author && author.subjects.find(userSubject => userSubject.comment._id === comment._id);
      if (author && !commentExists) {
        author.subjects.push({ comment, focus });
      }
    }
  }

  for (user of Object.values(store.users)) {
    user.subjects.sort(function sortSubjectComments(subject1, subject2) {
      const date1 = new Date(subject1.comment.created_at);
      const date2 = new Date(subject2.comment.created_at);
      return date2 - date1;
    });
  }

  return store.subjects;
}

module.exports = fetchSubjects();


