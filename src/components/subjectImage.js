module.exports = function subjectImage(subject) {
  try {
    let url = subject.location.standard;
    const passThrough = url.endsWith('.png');
    url = url.replace('http://', 'https://');
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
