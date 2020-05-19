const project = require('../../helpers/project');

module.exports = async function () {
  console.log('getting project details');
  return await project;
}
