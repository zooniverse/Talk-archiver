const API = require('../../helpers/api');

module.exports = async function fetchRecents() {
  const recents = await API.get('recents');
  return { recents };
};
