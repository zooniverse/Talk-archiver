const API = require('./api');
const store = require('./store');

async function fetchPage(boardID, discussionID, page) {
  const data = API.get(`boards/${boardID}/discussions/${discussionID}?page=${page}`);
  return data;
}

module.exports = async function fetchDiscussion(board, discussion, numPages) {
  let comments = [];
  let fullDiscussion = {};
  let promises = [];

  for (let page = 1; page <= numPages; page++) {
    promises.push(fetchPage(discussion.board._id, discussion.zooniverse_id, page));
  }

  const pages = await Promise.all(promises);
  for (pageData of pages) {
    comments = comments.concat(pageData.comments);
    fullDiscussion = pageData;
  }

  if (fullDiscussion.focus && fullDiscussion.focus.base_type === 'Subject') {
    const subject = fullDiscussion.focus;
    store.subjects[subject.zooniverse_id] = subject;
  }

  return Object.assign({}, discussion, fullDiscussion, { comments });
}

