const awaitProjects = require('./projects');

const args = process.argv.slice(2);
const talkDomain = args[args.length - 1];

async function fetchProject() {
  const projects = await awaitProjects;
  const domain = talkDomain.replace('talk.', 'www.');
  const [ project ] = projects.filter(project => project.bucket_path === domain);
  return project;
}

async function project() {
  const project = await fetchProject();
  project.domain = talkDomain;
  return project;
}

module.exports = project();
