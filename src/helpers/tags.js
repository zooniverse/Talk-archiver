const store = require('./store');
const awaitBoards = require('./boards');
const awaitCollections = require('./collections');
const awaitSubjects = require('./subjects');

function hasTag(item, tag) {
  if (item.tags && item.tags.indexOf(tag) > -1) {
    return true;
  }
  const matchingTags = item.tags && item.tags.filter(itemTag => tag === itemTag._id);
  return matchingTags && matchingTags.length > 0;
}

function uniqueTags(items, tags) {
  for (item of items) {
    item.tags && item.tags.forEach(tag => {
      tagName = tag._id || tag;
      tags[tagName] = tag;
    });
  }
  return tags;
}

function allUniqueTags({ discussions, subjects, userCollections }) {
  let tags = {};

  tags = uniqueTags(Object.values(subjects), tags);

  for (discussion of Object.values(discussions)) {
    tags = uniqueTags(discussion.comments, tags);
  }

  tags = uniqueTags(Object.values(userCollections), tags);

  return Object.keys(tags);
}

function buildTagCollection(tag, data) {
  // console.log('building tag', tag);
  const subjects = Object.values(data.subjects).filter(subject => hasTag(subject, tag));
  const discussions = Object.values(data.discussions).filter(discussion => {
    const taggedComments = discussion.comments.filter(comment => hasTag(comment, tag));
    return taggedComments.length > 0;
  });
  const userCollections = Object.values(data.userCollections).filter(userCollection => hasTag(userCollection, tag));
  return {
    name: tag,
    discussions: discussions.map(discussion => discussion.zooniverse_id),
    subjects: subjects.map(subject => subject.zooniverse_id),
    userCollections: userCollections.map(collection => collection.zooniverse_id)
  };
}

async function tags() {
  const userTags = {};
  const [ boards, userCollections, subjects ] = await Promise.all([awaitBoards, awaitCollections, awaitSubjects]);
  const { discussions } = store;
  const tagNames = allUniqueTags({ discussions, subjects, userCollections });
  for (tag of tagNames) {
    userTags[tag] = buildTagCollection(tag, { discussions, subjects, userCollections });
  }
  console.log('read', Object.keys(userTags).length, 'tags');
  return userTags;
}

module.exports = tags();

