const fs = require('fs');
const path = require('path');
const readline = require('readline');
const project = require('./project');

async function discussionComments() {
/*
  Read the discussions export and return all discussions filtered by type:
    - board discussions.
    - collection comments.
    - subject comments.
*/
  const { name } = await project;
  const discussions = [];
  let boards = [];
  let collections = [];
  let subjects = [];

  const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, '../../.data', `${name}_discussions.json`)),
      output: process.stdout,
      terminal: false
  });

  rl.on('line', (line) => {
    const discussion = JSON.parse(line);
    discussions.push(discussion);
  });

  return new Promise( (resolve, reject) => {
    rl.on('close', () => {
      collections = discussions.filter(discussion => !discussion.board._id && discussion.focus.base_type === 'Collection');
      subjects = discussions.filter(discussion => !discussion.board._id && discussion.focus.base_type === 'Subject');
      boards = discussions.filter(discussion => !!discussion.board._id);
      console.log('collection discussions', collections.length)
      resolve({ boards, collections, subjects });
    });
  });
}

module.exports = discussionComments();
