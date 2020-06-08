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

module.exports = function discussionSummary({ discussion, className }) {
  const lastPost = moment(discussion.last_comment.created_at).format('LLL');
  const posts = discussion.comments.length || discussion.comments;
  const classAttr = className ? `class="${className}"` : '';
  return `
    <p ${classAttr}>
      <a href="/boards/${ discussion.board._id }/discussions/${ discussion.zooniverse_id }">
        ${ discussion.title }
      </a>
    </p>
    <p>${ posts } posts / ${ authorCount(discussion) } participants</p>
    <p>
      Last post
      <time datetime="${discussion.last_comment.created_at}">${ lastPost }</time>
      by
      <a href="/users/${slug(discussion.last_comment.user_name)}">
        ${ discussion.last_comment.user_name }
      </a>
    </p>
  </p>
  `
}