const moment = require('moment');
const slug = require('../helpers/slug');

function authorCount(discussion) {
  if (discussion.users) {
    return discussion.users;
  }

  const authors = {};
  for (comment of discussion.comments) {
    authors[comment.user_name] = null;
  }
  return Object.keys(authors).length;
}

function discussionSummary(discussion) {
  const lastPost = moment(discussion.last_comment.created_at).format('LLL');
  const posts = discussion.comments.length || discussion.comments;
  return `
    <p>
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

function listItem(discussion) {
  return `
    <li class="discussion-preview">
      ${discussionSummary(discussion)}
    </li>
  `
}

module.exports = function featuredDiscussions(discussions) {
  return `
    <ul class="discussion-list">
      ${discussions.map(listItem).join('\n')}
    </ul>
  `
}
