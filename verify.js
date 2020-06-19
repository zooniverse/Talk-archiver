const logSymbols = require('log-symbols');

const fs = require('fs');
const path = require('path');
const manifest = require('./dist/manifest/build');

const source = path.resolve(__dirname, './dist/api');
const dirs = fs.readdirSync(source, { withFileTypes: true })
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