const awaitProject = require('../../helpers/project');

module.exports = async function () {
  const project = await awaitProject;
  return { project };
}
