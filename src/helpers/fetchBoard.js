const API = require('./api')
const fetchDiscussion = require('./fetchDiscussion');

async function fetchPage(boardID, page) {
  const data = await API.get(`boards/${boardID}?page=${page}`);
  return data;
}

module.exports = async function fetchBoard(board, pages) {
  const discussions = [];
  console.log('build discussions', board.zooniverse_id, board.discussions, pages)

  for (let page = 1; page <= pages; page++) {
    const pageData = await fetchPage(board.zooniverse_id, page);

    for (discussion of pageData.discussions) {
      const commentsCount = discussion.comments_count || discussion.comments;
      const pages = Math.ceil(commentsCount / 10) || 1;
      const fullDiscussion = await fetchDiscussion(board, discussion, pages);
      discussions.push(fullDiscussion);
    }
  }

  return Object.assign({}, board, { discussions });
}

