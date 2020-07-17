function URLFromLocation(location) {
  if (location.mp4) {
    return location.mp4;
  }

  if ( Array.isArray(location) ) {
    return location[0] || '';
  }

  if (typeof location === 'object') {
    const urls = Object.values(location);
    return urls[0];
  }

  return location;
}

module.exports = function subjectLocation(location) {
  let url = URLFromLocation(location);
  url = url.replace('zooniverse-static.s3.amazonaws.com', 'static.zooniverse.org');
  url = url.replace('http://', 'https://');
  return url;
}
