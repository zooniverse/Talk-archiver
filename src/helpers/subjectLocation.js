module.exports = function subjectLocation(location) {
  let url = location;
  if ( Array.isArray(location) ) {
    url = location[0];
  }
  url = url.replace('zooniverse-static.s3.amazonaws.com', 'static.zooniverse.org');
  url = url.replace('http://', 'https://');
  return url;
}
