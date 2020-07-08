const subjectComment = require('./subjectComment')

module.exports = async function subjectCommentsList({ subjects }) {
  const awaitComments = subjects.map(subject => subjectComment({ subject }));
  const comments = await Promise.all(awaitComments);
  return `
    <ul class="comments-list">
      ${comments.map(comment => `
        <li>
          ${comment}
        </li>
      `)}
    </ul>
  `
}