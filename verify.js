const logSymbols = require('log-symbols');

const fs = require('fs');
const path = require('path');
const manifest = require('./dist/manifest/build');

console.log(`Verifying JSON output.`);
let source = path.resolve(__dirname, './dist/api');
let dirs = fs.readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())

dirs.forEach(dir => {
  const dirPath = path.resolve(source, dir.name);
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));
  if (files.length === manifest[dir.name]) {
    console.log(logSymbols.success, dir.name, files.length)
  } else {
    console.error(logSymbols.error, dir.name, files.length, '(', manifest[dir.name], ')');
  }
});

console.log(`Verifying HTML output.`);
source = path.resolve(__dirname, './dist');
dirs = fs.readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !!manifest[dirent.name]);

dirs.forEach(dir => {
  const dirPath = path.resolve(source, dir.name);
  const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
  if (files.length === manifest[dir.name]) {
    console.log(logSymbols.success, dir.name, files.length)
  } else {
    console.error(logSymbols.error, dir.name, files.length, '(', manifest[dir.name], ')');
  }
});

// discussions are subdirectories of boards
let discussionsCount = 0;
source = path.resolve(__dirname, './dist/boards');
const boards = fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

boards.forEach(board => {
  const discussionsPath = path.resolve(source, board.name, 'discussions');
  const discussions = fs.readdirSync(discussionsPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
  discussionsCount = discussionsCount + discussions.length;
});

if (discussionsCount === manifest.discussions) {
  console.log(logSymbols.success, 'discussions', discussionsCount);
} else {
  console.error(logSymbols.error, 'discussions', discussionsCount, '(', manifest.discussions, ')');
}