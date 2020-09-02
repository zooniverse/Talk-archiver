const awaitRoles = require('../../helpers/roles');

module.exports = async function fetchRoles() {
  const roles = await awaitRoles;
  return { roles };
}
