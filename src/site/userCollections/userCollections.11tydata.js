const awaitCollections = require('../../helpers/collections');
const store = require('../../helpers/store');

module.exports = async function () {
  const userCollections = await awaitCollections;
  const { discussions } = store;
  return { discussions, userCollections };
}