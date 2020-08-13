const PLACEHOLDER = 'https://placehold.it/300x215&text=Not%20available'

function URLFromLocation(location) {
  if (location.mp4) {
    return location.mp4;
  }

  if ( Array.isArray(location) ) {
    return location[0] || PLACEHOLDER;
  }

  if (typeof location === 'object') {
    const urls = Object.values(location);
    return urls[0] || PLACEHOLDER;
  }

  return location || PLACEHOLDER;
}

module.exports = function subjectLocation(location) {
  let url = URLFromLocation(location);
  url = url.replace('zooniverse-static.s3.amazonaws.com', 'static.zooniverse.org');
  url = url.replace('www.galaxyzoo.org.s3.amazonaws.com', 's3.amazonaws.com/www.galaxyzoo.org');
  url = url.replace('http://', 'https://');
  return url;
}
