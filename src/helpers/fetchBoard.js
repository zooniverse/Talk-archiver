const fetch = require('node-fetch');
const fetchDiscussion = require('./fetchDiscussion');

async function fetchPage(host, project, boardID, page) {
  console.log('fetching board page', boardID, page)
  const response = await fetch(
      `${host}/_ouroboros_api/projects/${project}/talk/boards/${boardID}?page=${page}`,
    {
      headers: { Accept: "application/json" }
    }
  );
  const data = await response.json();
  return data;
}

module.exports = async function fetchBoard(host, project, board, pages) {
  let discussions = [];
  console.log('build discussions', board.zooniverse_id, board.discussions, pages)

  for (let page = 1; page <= pages; page++) {
    const pageData = await fetchPage(host, project, board.zooniverse_id, page);
    discussions = discussions.concat(pageData.discussions);
  }

  for (discussion of discussions) {
    const pages = Math.ceil(discussion.comments_count / 10) || 1;
    const fullDiscussion = await fetchDiscussion(host, project, board, discussion, pages);
    discussion = fullDiscussion;
  }

  board.discussions = discussions;
  return board;
}

