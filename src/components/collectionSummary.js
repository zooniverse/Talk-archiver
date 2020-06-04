const subjectImage = require('./subjectImage');

function collectionSubject(subject) {
  return `
    <li class="subject">
      <a href="/subjects/${ subject.zooniverse_id }">
        ${ subjectImage(subject, 'thumb') }
      </a>
    </li>
  `
}

module.exports = function collectionSummary(collection, limit, className='') {
  const subjects = collection.subjects ? collection.subjects.slice(0, limit) : [];
  const zooniverse_id = collection.zooniverse_id || collection._id;
  const title = collection.title || collection.name;
  const owner = collection.user_name ? `${collection.user_name}:` : '';
  return `
    <p>
      <a href="/collections/${ zooniverse_id }">
        ${ owner || zooniverse_id } ${ title }
      </a>
    </p>
    <ul class="collection ${className}">
      ${subjects.map(collectionSubject).join('\n')}
    </ul>
  `
}