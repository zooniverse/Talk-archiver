const awaitProjects = require('./projects');
const config = require('../config');

async function fetchProject(name) {
  const projects = await awaitProjects;
  const [ project ] = projects.filter(project => project.name === name);
  return project;
}

async function project() {
  const project = await fetchProject(config.project.name);
  project.domain = config.project.domain;
  return project;
}

module.exports = project();
