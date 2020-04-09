const fetch = require('node-fetch');

async function fetchPage(host, project, boardID, discussionID, page) {
  console.log('fetching discussion page', boardID, page)
  const response = await fetch(
      `${host}/_ouroboros_api/projects/${project}/talk/boards/${boardID}/discussions/${discussionID}?page=${page}`,
    {
      headers: { Accept: "application/json" }
    }
  );
  const data = await response.json();
  return data;
}

module.exports = async function fetchDiscussion(host, project, board, discussion, pages) {
  let comments = [];
  console.log('build comments', discussion.zooniverse_id, discussion.comments, pages)

  for (let page = 1; page <= pages; page++) {
    const pageData = await fetchPage(host, project, discussion.board._id, discussion.zooniverse_id, page);
    comments = comments.concat(pageData.comments);
  }

  discussion.comments = comments;
  return discussion;
}

