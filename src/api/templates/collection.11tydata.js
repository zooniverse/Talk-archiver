const awaitCollections = require('../../helpers/collections');

module.exports = async function () {
  const userCollections = await awaitCollections;
  return { userCollections };
}