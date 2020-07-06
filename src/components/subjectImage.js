const subjectLocation = require('../helpers/subjectLocation')

function img(classAttr, alt, src) {
  return `<img ${classAttr} loading=lazy alt="${alt}" src=${src}>`
}

function video(classAttr, alt, src) {
  return `
    <video ${classAttr} src=${src}>
      <p>${alt}</p>
    </video>
  `
}

module.exports = function subjectImage(subject, size='standard', className) {
  try {
    let url = subjectLocation(subject.location.standard);
    const passThrough = (size === 'standard') || url.endsWith('.png') || url.endsWith('.mp4');
    const zooniverseID = subject.zooniverse_id || subject._id;
    const staticRoot = 'static.zooniverse.org';
    const thumbnailPath = url.replace('https://', '');
    const src =  passThrough ? url : `https://thumbnails.zooniverse.org/150x150/${thumbnailPath.replace(staticRoot, '')}`;
    const classAttr = className ? `class="${className}"` : '';
    const alt = `Subject ${zooniverseID}`;
    return src.endsWith('.mp4') ? video(classAttr, alt, src) : img(classAttr, alt, src);
  } catch (e) {
    console.log(e.message);
    console.log(subject);
    return '';
  }
}
