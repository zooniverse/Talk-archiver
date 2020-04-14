const fetch = require('node-fetch');

const HOST = 'https://www.penguinwatch.org';
const PROJECT = 'illustratedlife';
const CACHING = true;

const apiCache = {};

async function get(url) {
  console.log(`Request: ${url}`);
  if (CACHING && apiCache[url]) {
    console.log('using cache')
    return apiCache[url];
  }

  const response = await fetch(
      `${HOST}/_ouroboros_api/projects/${PROJECT}/talk/${url}`,
    {
      headers: { Accept: "application/json" }
    }
  );
  const data = await response.json();
  apiCache[url] = Object.assign({}, data);
  return data;
}

module.exports = { get };
