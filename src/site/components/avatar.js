module.exports = function avatar(username, url) {
  // default to the simple Zoo logo avatar.
  url = url ? url : 'https://static.zooniverse.org/www.zooniverse.org/assets/simple-avatar.jpg';
  // Replace the old default Talk avatar with the new one.
  url = url.endsWith('/default_forum_avatar.png') ? 'https://static.zooniverse.org/www.zooniverse.org/assets/simple-avatar.jpg': url;
  const alt = username;
  const passThrough = url.endsWith('.png') || url.endsWith('simple-avatar.jpg');
  url = url.replace('http://', 'https://');
  // Resize user avatars.
  const src =  passThrough ? url : `https://thumbnails.zooniverse.org/50x50/${url.slice(8)}`;
  return `<img class="avatar" alt="${alt}" src="${src}" width=20 height=20 />`
}
