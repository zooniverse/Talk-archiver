const awaitProject = require('../helpers/project');
const markdownIt = require("markdown-it");
const markdownItEmoji = require("markdown-it-emoji");
const markdownItRegex = require('markdown-it-regex').default;
const options = {
  html: true,
  breaks: true,
  linkify: true
};
const slug = require('../helpers/slug');

const mentionUsers = {
  name: 'mentionUsers',
  regex: /@(\w+)\b/,
  replace: (match) => {
    const url = `/users/${slug(match)}`;
    return `<a href="${url}">@${match}</a>`;
  }
}

const mentionTags = {
  name: 'mentionTags',
  regex: /#([\w-]+)\b/,
  replace: (match) => {
    const url = `/tags/${match.toLowerCase()}`;
    return `<a href="${url}">#${match}</a>`;
  }
}

async function projectSubjects() {
  const project = await awaitProject;
  const { site_prefix } = project;
  const subjectRegex = new RegExp(`\\b(?<!\\/)(A${site_prefix}\\w+)(?!\\])\\b`);
  return {
    name: 'mentionSubjects',
    // match any subject ID that doesn't begin with / or end in ]
    regex: subjectRegex,
    replace: (match) => {
      const url = `/subjects/${match}`;
      return `<a href="${url}">${match}</a>`;
    }
  }
}

const awaitMentionSubjects = projectSubjects();

async function projectCollections() {
  const project = await awaitProject;
  const { site_prefix } = project;
  const collectionRegex = new RegExp(`\\b(?<!\\/)(C${site_prefix}\\w+)(?!\\])\\b`);
  return {
    name: 'mentionCollections',
    regex: collectionRegex,
    replace: (match) => {
      const url = `/collections/${match}`;
      return `<a href="${url}">${match}</a>`;
    }
  }
}

const awaitMentionCollections = projectCollections();

async function zooMd() {
  const mentionSubjects = await awaitMentionSubjects;
  const mentionCollections = await awaitMentionCollections;
  return markdownIt(options)
    .use(markdownItEmoji)
    .use(markdownItRegex, mentionUsers)
    .use(markdownItRegex, mentionTags)
    .use(markdownItRegex, mentionSubjects)
    .use(markdownItRegex, mentionCollections);
}

const awaitMd = zooMd();

module.exports = async function markdown(content) {
  const md = await awaitMd;
  return content ? md.render(content.trim()) : '';
}
