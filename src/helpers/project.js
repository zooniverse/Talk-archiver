const awaitProjects = require('./projects');

async function fetchProject(name) {
  const projects = await awaitProjects;
  const [ project ] = projects.filter(project => project.name === name);
  return project;
}

async function project() {
  return await fetchProject('illustratedlife');
}

module.exports = project();
