const moment = require('moment');
const slug = require('../helpers/slug');

function authorCount(discussion, className) {
  if (discussion.users) {
    return discussion.users;
  }

  const authors = {};
  for (comment of discussion.comments) {
    authors[comment.user_name] = null;
  }
  return Object.keys(authors).length;
}

function lastPost(comment) {
  return `
    <p>
      Last post
      <time datetime="${comment.created_at}">${ moment(comment.created_at).format('LLL') }</time>
      by
      <a href="/users/${slug(comment.user_name)}">
        ${ comment.user_name }
      </a>
    </p>
  `;
}

module.exports = function discussionSummary({ discussion, className }) {
  const posts = discussion.comments.length || discussion.comments;
  const classAttr = className ? `class="${className}"` : '';
  return `
    <p ${classAttr}>
      <a href="/boards/${ discussion.board._id }/discussions/${ discussion.zooniverse_id }">
        ${ discussion.title }
      </a>
    </p>
    <p>${ posts } posts / ${ authorCount(discussion) } participants</p>
    ${ discussion.last_comment ? lastPost(discussion.last_comment) : ''}
  `
}