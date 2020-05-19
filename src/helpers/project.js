const awaitProjects = require('./projects');
const config = require('../config');

async function fetchProject(name) {
  const projects = await awaitProjects;
  const [ project ] = projects.filter(project => project.name === name);
  return project;
}

async function project() {
  return await fetchProject(config.project.name);
}

module.exports = project();
