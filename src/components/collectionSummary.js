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
  const attribution = collection.user_name ? ` by ${collection.user_name}` : '';
  const plural = collection.subjects && collection.subjects.length > 1 ? 's' : '';
  const size = collection.subjects && collection.subjects.length ? `(${ collection.subjects.length } subject${ plural })` : '';
  return `
    <p class="collection-link">
      <a href="/collections/${ zooniverse_id }">${ title }${ attribution }</a> ${ size }
    </p>
    <ul class="collection ${className}">
      ${subjects.map(collectionSubject).join('\n')}
    </ul>
  `
}