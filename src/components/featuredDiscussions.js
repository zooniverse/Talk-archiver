const discussionSummary = require('./discussionSummary');

function listItem(discussion) {
  return `
    <li class="discussion-preview">
      ${discussionSummary({ discussion })}
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
