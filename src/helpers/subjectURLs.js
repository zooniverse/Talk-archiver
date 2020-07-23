const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const project = require('./project');
const store = require('./store');

const subjectURLs = [];

function parseRow({ ouroboros_subject_id }) {
  const subjectURL = `subjects/${ouroboros_subject_id}`;
  subjectURLs.push(subjectURL);
}

async function fetchSubjectURLs() {
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
  return urls;
}

module.exports = fetchSubjectURLs();


