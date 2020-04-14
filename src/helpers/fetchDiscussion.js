const API = require('./api');

async function fetchPage(boardID, discussionID, page) {
  const data = await API.get(`boards/${boardID}/discussions/${discussionID}?page=${page}`);
  return data;
}

module.exports = async function fetchDiscussion(board, discussion, pages) {
  let comments = [];
  console.log('build comments', discussion.zooniverse_id, discussion.comments, pages)

  for (let page = 1; page <= pages; page++) {
    const pageData = await fetchPage(discussion.board._id, discussion.zooniverse_id, page);
    comments = comments.concat(pageData.comments);
  }

  return Object.assign({}, discussion, { comments });
}

