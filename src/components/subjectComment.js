const markdown = require('./markdown');
const moment = require('moment');
const subjectImage = require('./subjectImage');

module.exports = async function subjectComment({ subject }) {
  const commentBody = await markdown(subject.comment.body);
  const created = moment(subject.comment.created_at).format('LLL');
  return `
    <a href="/subjects/${ subject.focus.zooniverse_id }">
      ${ subjectImage(subject.focus, 'thumb') }
    </a>
    ${ commentBody }
    <time datetime="${ subject.comment.created_at }">${ created}</time>
  `;
}