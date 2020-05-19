const CacheAsset = require("@11ty/eleventy-cache-assets");
const { default: RequestQueue, END_EVENT, ITEM_EVENT } = require('limited-request-queue');
const fetchProject = require('./fetchProject')

const HOSTS = ['https://www.penguinwatch.org'];
const PROJECT = fetchProject('illustratedlife');

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
.on(END_EVENT, () => console.log(requestCount, 'requests completed.'));

async function getURL(url) {
  const host = HOSTS[requestCount % HOSTS.length];
  const { name } = await PROJECT;
  requestCount++;
  return new Promise((resolve, reject) => {
    requestQueue.enqueue(new URL(`${host}/_ouroboros_api/projects/${name}/talk/${url}`), { resolve, reject });
  });
}

async function batchedGet(urls) {
  const uniqueURLs = urls.filter((url, index, self) => self.indexOf(url) === index);
  const promises = uniqueURLs.map(getURL)
  return Promise.all(promises);
}

module.exports = { batchedGet, get: getURL };
