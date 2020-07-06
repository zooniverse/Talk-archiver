const discussionComments = require('./discussionComments');

function hasTag(discussion, tag) {
  const taggedComments = discussion.comments.filter(function(comment) {
    if (comment.tags && comment.tags.indexOf(tag) > -1) {
      return true;
    }
    const matchingTags = comment.tags && comment.tags.filter(itemTag => tag === itemTag._id);
    return matchingTags && matchingTags.length > 0;
  });
  return taggedComments.length > 0;
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

function allUniqueTags({ discussions, subjects, collections }) {
  let tags = {};

  for (discussion of subjects) {
    tags = uniqueTags(discussion.comments, tags);
  }

  for (discussion of discussions) {
    tags = uniqueTags(discussion.comments, tags);
  }

  for (discussion of collections) {
    tags = uniqueTags(discussion.comments, tags);
  }

  return Object.keys(tags);
}

function buildTagCollection(tag, data) {
  const subjects = data.subjects.filter(discussion => hasTag(discussion, tag));
  const discussions = data.discussions.filter(discussion => hasTag(discussion, tag));
  const userCollections = data.collections.filter(discussion => hasTag(discussion, tag));
  return {
    name: tag,
    discussions,
    subjects: subjects.map(subject => subject.focus),
    userCollections: userCollections.map(collection => collection.focus)
  };
}

async function tags() {
  const userTags = {};
  const { boards: discussions, collections, subjects } = await discussionComments;
  const tagNames = allUniqueTags({ discussions, subjects, collections });
  for (tag of tagNames) {
    userTags[tag] = buildTagCollection(tag, { discussions, subjects, collections });
  }
  console.log('read', Object.keys(userTags).length, 'tags');
  return userTags;
}

module.exports = tags();

