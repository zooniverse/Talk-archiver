const awaitProjects = require('./projects');
const talkDomain = require('./talkDomain')

const args = process.argv.slice(2);
const buildName = args[args.length - 1];

async function fetchProject() {
  const projects = await awaitProjects;
  const bucketPath = buildName.replace('talk.', 'www.');
  let [ project ] = projects.filter(project => project.bucket_path === bucketPath);
  if (!project) {
    const namedProjects= projects.filter(project => project.name === buildName);
    project = namedProjects[0];
  }
  return project;
}

async function project() {
  const project = await fetchProject();
  project.domain = talkDomain(project);
  return project;
}

module.exports = project();
