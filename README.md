# Talk-archiver
A static site generator for old Ouroboros project Talk forums, based on elevenpack.

## Usage

```
yarn install
```

Install the dependencies.

```
yarn build
```

Run this to run the following build scripts:
1. `yarn build:assets` to build the `dist/assets/` directory for static site
0. `yarn build:api` to build `dist/api/` directory from the Ouroboros API, without building the entire site. It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
0. `yarn build:site` to build static HTML pages in `dist/` for `users`, `tags`, `recents` and `collections` resources.
It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
0. `yarn build:boards` to build the boards HTML pages in `dist/`.
0. `yarn build:subjects` to build the subjects HTML pages in `dist/`.

Alternatively run those scripts individually to build the API data in `.cache/` and HTML content in `dist/`.

```
yarn dev
```

Build and start a development site on http://localhost:8080.

Cache the API data from Ouroboros, then build the full API and site. Output will be in `/dist`.

```
yarn deploy
```

Copy the site from `/dist` to S3.

## Run with Docker

Get a bash session in the container:
``` bash
docker-compose run --service-ports --rm talk-archiver bash
```
