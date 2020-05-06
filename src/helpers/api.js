const fetch = require('node-fetch');
const { default: RequestQueue, END_EVENT, ITEM_EVENT } = require('limited-request-queue');

const HOSTS = ['https://www.penguinwatch.org'];
const PROJECT = 'illustratedlife';
const CACHING = true;

const apiCache = {};
let requestCount = 0;

const requestQueue = new RequestQueue({
  maxSockets: 10,
  maxSocketsPerHost: 10
})
.on(ITEM_EVENT, async function handleURL(url, promise, done) {
  console.log('Requesting', url.toString());
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
    const host = HOSTS[requestCount % HOSTS.length];
    requestCount++;
    requestQueue.enqueue(new URL(`${host}/_ouroboros_api/projects/${PROJECT}/talk/${url}`), { resolve });
  });
  return promise;
}

async function batchedGet(urls) {
  const uniqueURLs = urls.filter((url, index, self) => self.indexOf(url) === index);
  const promises = uniqueURLs.map(getURL)
  return Promise.all(promises);
}

module.exports = { batchedGet, get: getURL };
