const subjectLocation = require('../helpers/subjectLocation')

module.exports = function subjectImage(subject, size='standard', className) {
  try {
    let url = subjectLocation(subject.location.standard);
    const passThrough = (size === 'standard') || url.endsWith('.png');
    const zooniverseID = subject.zooniverse_id || subject._id;
    const staticRoot = 'static.zooniverse.org';
    const thumbnailPath = url.replace('https://', '');
    const src =  passThrough ? url : `https://thumbnails.zooniverse.org/150x150/${thumbnailPath.replace(staticRoot, '')}`;
    const classAttr = className ? `class=${className}` : '';
    return `<img ${classAttr} loading=lazy alt="Subject ${zooniverseID}" src=${src}>`;
  } catch (e) {
    console.log(e.message);
    console.log(subject);
    return '';
  }
}
