module.exports = function subjectImage(subject, size='standard') {
  try {
    let url = subject.location.standard.replace('http://', 'https://');
    const passThrough = (size === 'standard') || url.endsWith('.png');
    const zooniverseID = subject.zooniverse_id || subject._id;
    const staticRoot = 'zooniverse-static.s3.amazonaws.com/';
    const thumbnailPath = url.replace('https://', '');
    const src =  passThrough ? url : `https://thumbnails.zooniverse.org/150x150/${thumbnailPath.replace(staticRoot, '')}`;
    return `<img loading=lazy alt="Subject ${zooniverseID}" src=${src}>`;
  } catch (e) {
    console.log(e.message);
    console.log(subject);
    return '';
  }
}
