const fetch = require('node-fetch');
const { default: RequestQueue, END_EVENT, ITEM_EVENT } = require('limited-request-queue');

const HOST = 'https://www.penguinwatch.org';
const PROJECT = 'illustratedlife';
const CACHING = true;

const apiCache = {};

const requestQueue = new RequestQueue({
  maxSockets: 10,
  maxSocketsPerHost: 10
})
.on(ITEM_EVENT, async function handleURL(url, promise, done) {
  const response = await fetch(
      url,
    {
      headers: { Accept: "application/json" }
    }
  );
  const data = await response.json();
  apiCache[url] = Object.assign({}, data);
  promise.resolve(apiCache[url]);
  done();
})

async function getURL(url) {
  if (CACHING && apiCache[url]) {
    console.log('using cache')
    return apiCache[url];
  }

  const promise = new Promise((resolve, reject) => {
    requestQueue.enqueue(new URL(`${HOST}/_ouroboros_api/projects/${PROJECT}/talk/${url}`), { resolve });
  });
  return promise;
}

async function batchedGet(urls) {
  console.log(`Batch Request: ${urls[0]}`);
  const promises = urls.map(getURL)
  return Promise.all(promises);
}

module.exports = { batchedGet, get: getURL };
