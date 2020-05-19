const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function fetchProjects() {
  const projects = [];

  const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, '../../.data', 'projects.json')),
      output: process.stdout,
      terminal: false
  });

  rl.on('line', (line) => {
    const project = JSON.parse(line);
    projects.push(project);
  });

  return new Promise( (resolve, reject) => {
    rl.on('close', () => {
      resolve(projects);
    });
  });
}

module.exports = fetchProjects();
