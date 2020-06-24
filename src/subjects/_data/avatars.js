const awaitAvatars = require('../../helpers/avatars');

module.exports = async function () {
  const avatars = await awaitAvatars;
  return avatars;
}
