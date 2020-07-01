const API = require('./api');

const zooTeam = ['DZM', 'bumishness', 'mrniaboc', 'VVH', 'srallen086'];

async function fetchRoles() {
  const roles = await API.get('users/roles');
  zooTeam.forEach((name) => {
    roles.push({ name, roles: ['Zooniverse Team'] });
  })
  return roles;
};

module.exports = fetchRoles();
