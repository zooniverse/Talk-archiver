const fetchProject = require('../../helpers/fetchProject');

module.exports = async function () {
  console.log('getting project details');
  return await fetchProject('illustratedlife');
}
