const moment = require('moment');

function discussionSummary(discussion) {
  const lastPost = moment(discussion.last_comment.created_at).format('LLL');
  return `
    <p>
      <a href="/boards/${ discussion.board._id }/discussions/${ discussion.zooniverse_id }">
        ${ discussion.title }
      </a>
    </p>
    <p>${ discussion.comments } posts / ${ discussion.users } participants</p>
    <p>
      Last post ${ lastPost } by
      <a href="/users/${discussion.last_comment.user_name}">
        ${ discussion.last_comment.user_name }
      </a>
    </p>
  </p>
  `
}

function listItem(discussion) {
  return `
    <li>
      ${discussionSummary(discussion)}
    </li>
  `
}

module.exports = function featuredDiscussions(discussions) {
  return `
    <ul>
      ${discussions.map(listItem).join('\n')}
    </ul>
  `
}
