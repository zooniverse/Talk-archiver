const API = require('./api');
const store = require('./store');

async function fetchPage(boardID, discussionID, page) {
  const data = await API.get(`boards/${boardID}/discussions/${discussionID}?page=${page}`);
  return data;
}

module.exports = async function fetchDiscussion(board, discussion, pages) {
  let comments = [];
  let fullDiscussion = {};
  console.log('build comments', discussion.zooniverse_id, discussion.comments, pages)

  for (let page = 1; page <= pages; page++) {
    const pageData = await fetchPage(discussion.board._id, discussion.zooniverse_id, page);
    comments = comments.concat(pageData.comments);
    fullDiscussion = pageData;
  }

  if (fullDiscussion.focus && fullDiscussion.focus.base_type === 'Subject') {
    const subject = fullDiscussion.focus;
    store.subjects[subject.zooniverse_id] = subject;
  }

  for (comment of comments) {
    const { user_name } = comment;
    const user = await API.get(`users/${user_name}`);
    store.users[user_name] = user;
  }

  return Object.assign({}, discussion, fullDiscussion, { comments });
}

