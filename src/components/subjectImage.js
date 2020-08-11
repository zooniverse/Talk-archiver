const subjectLocation = require('../helpers/subjectLocation')

function img(classAttr, alt, src) {
  return `<img ${classAttr} loading=lazy alt="${alt}" src=${src}>`
}

function video(classAttr, alt, src, poster) {
  return `
    <video ${classAttr} controls poster=${poster} preload="none" src=${src}>
      <p>${alt}</p>
    </video>
  `
}

module.exports = function subjectImage(subject, size='standard', className) {
  try {
/*
  Chimp & See stores videos in location.standard and images in location.previews.
*/
    let previewLocation = subject.location.previews || subject.location.standard;
    let standardLocation = size === 'standard' ? subject.location.standard : previewLocation;
    let url = subjectLocation(standardLocation || subject.location);
    const passThrough = 
      (size === 'standard') ||
      url.endsWith('.png') ||
      url.endsWith('.mp4') ||
      url.startsWith('https://placehold.it') ||
      url.includes('s3.amazonaws.com');
    const zooniverseID = subject.zooniverse_id || subject._id;
    const staticRoot = 'static.zooniverse.org';
    const thumbnailPath = url.replace('https://', '');
    let src =  passThrough ? url : `https://thumbnails.zooniverse.org/150x150/${thumbnailPath.replace(staticRoot, '')}`;
    const classAttr = className ? `class="${className}"` : '';
    const alt = `Subject ${zooniverseID}`;
    const { metadata } = subject;
    const counters = metadata && metadata.counters;
    const poster = previewLocation[0] && previewLocation[0][0];
    if (counters && counters.human) {
      src = 'https://placehold.it/300x215&text=Human'
    }
    return src.endsWith('.mp4') ? video(classAttr, alt, src, poster) : img(classAttr, alt, src);
  } catch (e) {
    console.log(e.message);
    console.log(subject);
    return '';
  }
}
