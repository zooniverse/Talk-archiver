const awaitProject = require('../../helpers/project');

module.exports = async function () {
  console.log('getting project details');
  const project = await awaitProject;
  return { project };
}
