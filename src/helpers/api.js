const CacheAsset = require("@11ty/eleventy-cache-assets");
const { default: RequestQueue, END_EVENT, ITEM_EVENT } = require('limited-request-queue');
const PROJECT = require('./project')

const ApiHost = 'https://api.zooniverse.org';

let requestCount = 0;

const requestQueue = new RequestQueue({
  maxSockets: 10,
  maxSocketsPerHost: 10
})
.on(ITEM_EVENT, async function handleURL(url, promise, done) {
  // console.log('Requesting', url.toString());
  try {
    const data = await CacheAsset(url.toString(), {
    	duration: "30d",
    	type: "json"
    });
    data.url = promise.url;
    promise.resolve(data);
  } catch (e) {
    console.log(e.message);
    promise.resolve({ url: promise.url });
  }
  done();
})
.on(END_EVENT, () => console.log(requestCount, 'requests completed.'));

async function getURL(url) {
  const { name } = await PROJECT;
  requestCount++;
  return new Promise((resolve, reject) => {
    requestQueue.enqueue(new URL(`${ApiHost}/projects/${name}/talk/${url}`), { resolve, reject, url });
  });
}

async function batchedGet(urls) {
  const uniqueURLs = urls.filter((url, index, self) => self.indexOf(url) === index);
  const promises = uniqueURLs.map(getURL)
  return Promise.all(promises);
}

module.exports = { batchedGet, get: getURL };
