const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const API = require('../../helpers/api');
const store = require('../../helpers/store');
const fetchUsers = require('./users');

const subjectURLs = [];

function parseRow({ ouroboros_subject_id }) {
  const subjectURL = `subjects/${ouroboros_subject_id}`;
  subjectURLs.push(subjectURL);
}

module.exports = async function fetchSubjects() {
  const users = await fetchUsers();

  const parseData = new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../../.data', 'illustratedlife_subject_ids.csv'))
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
      const commentExists = author.subjects.find(subject => subject.comment._id === comment._id);
      if (!commentExists) {
        author.subjects.push({ comment, focus });
      }
    }
  }

  return store.subjects;
}

