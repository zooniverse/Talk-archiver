const CacheAsset = require("@11ty/eleventy-cache-assets");
const { default: RequestQueue, END_EVENT, ITEM_EVENT } = require('limited-request-queue');

const HOSTS = ['https://www.penguinwatch.org'];
const PROJECT = 'illustratedlife';

let requestCount = 0;

const requestQueue = new RequestQueue({
  maxSockets: 10,
  maxSocketsPerHost: 10
})
.on(ITEM_EVENT, async function handleURL(url, promise, done) {
  console.log('Requesting', url.toString());
  try {
    const data = await CacheAsset(url.toString(), {
    	duration: "30d",
    	type: "json"
    });
    promise.resolve(data);
  } catch (e) {
    console.log(e.message);
    promise.resolve({});
  }
  done();
})

async function getURL(url) {
  const promise = new Promise((resolve, reject) => {
    const host = HOSTS[requestCount % HOSTS.length];
    requestCount++;
    requestQueue.enqueue(new URL(`${host}/_ouroboros_api/projects/${PROJECT}/talk/${url}`), { resolve, reject });
  });
  return promise;
}

async function batchedGet(urls) {
  const uniqueURLs = urls.filter((url, index, self) => self.indexOf(url) === index);
  const promises = uniqueURLs.map(getURL)
  return Promise.all(promises);
}

module.exports = { batchedGet, get: getURL };
