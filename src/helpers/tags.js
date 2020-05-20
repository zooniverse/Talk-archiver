const store = require('./store');

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

function allUniqueTags() {
  let tags = {};
  const { discussions, subjects, userCollections } = store;

  tags = uniqueTags(Object.values(subjects), tags);

  for (discussion of Object.values(discussions)) {
    tags = uniqueTags(discussion.comments, tags);
  }

  tags = uniqueTags(Object.values(userCollections), tags);

  return Object.keys(tags);
}

function buildTagCollection(tag) {
  console.log('building tag', tag);
  const subjects = Object.values(store.subjects).filter(subject => hasTag(subject, tag));
  const discussions = Object.values(store.discussions).filter(discussion => {
    const taggedComments = discussion.comments.filter(comment => hasTag(comment, tag));
    return taggedComments.length > 0;
  });
  const userCollections = Object.values(store.userCollections).filter(userCollection => hasTag(userCollection, tag));
  return {
    name: tag,
    discussions: discussions.map(discussion => discussion.zooniverse_id),
    subjects: subjects.map(subject => subject.zooniverse_id),
    userCollections: userCollections.map(collection => collection.zooniverse_id)
  };
}

module.exports = function tags() {
  const tagNames = allUniqueTags();
  for (tag of tagNames) {
    store.tags[tag] = buildTagCollection(tag);
  }
  return store.tags;
}

