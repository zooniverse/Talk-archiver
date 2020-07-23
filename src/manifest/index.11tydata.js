const awaitBoards = require('../helpers/boards');
const awaitCollections = require('../helpers/collections');
const awaitSubjects = require('../helpers/subjects');
const awaitTags = require('../helpers/tags');
const awaitUsers = require('../helpers/users');
const store = require('../helpers/store');

const CATEGORIES = [
  'chat',
  'help',
  'science'
]

function size(obj) {
  return Object.keys(obj).length;
}

module.exports = async function () {
  const [ boards, userCollections, subjects, userTags, users ] = await Promise.all([
    awaitBoards,
    awaitCollections,
    awaitSubjects,
    awaitTags,
    awaitUsers
  ]);
  const { discussions } = store;

  let boardCount = 0;
  for (category of CATEGORIES) {
    boardCount = boardCount + size(boards[category]);
  }

  const manifest = {
    boards: boardCount,
    discussions: size(discussions),
    collections: size(userCollections),
    subjects: size(subjects),
    tags: size(userTags),
    users: size(users)
  };

  return { manifest };
}