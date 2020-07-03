const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const API = require('./api');
const project = require('./project');
const store = require('./store');

const subjectURLs = [];

function parseRow({ ouroboros_subject_id }) {
  const subjectURL = `subjects/${ouroboros_subject_id}`;
  subjectURLs.push(subjectURL);
}

async function fetchSubjects() {
  const { name } = await project;

  const parseData = new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../.data', `${name}_subject_ids.csv`))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', parseRow)
      .on('end', (rowCount) => {
        resolve(subjectURLs);
        console.log('read', rowCount, 'subjects')
      });
  })

  const urls = await parseData;
  const APIsubjects = await API.batchedGet(urls);
  const subjects = {};

  for (subject of APIsubjects) {
    if (subject && subject.url !== `subjects/${subject.zooniverse_id}`) {
      console.error(`Subject mismatch: ${subject.url} ${subject.zooniverse_id}`);
    } else {
      subjects[subject.zooniverse_id] = subject;
    }
  }

  console.log('loaded', Object.keys(subjects).length, 'subjects');
  return subjects;
}

module.exports = fetchSubjects();


