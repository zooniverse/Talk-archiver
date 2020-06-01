# Talk-archiver
A static site generator for old Ouroboros project Talk forums, based on elevenpack.

## Usage

```
yarn install
```

Install the dependencies.

```
yarn dev
```

Build and start a development site on http://localhost:8080.

Cache the API data from Ouroboros, then build the full API and site. Output will be in `/dist`.


```
yarn build
```

Will run the following build scripts in order:
1. `yarn build:assets` to build the `dist/assets/` directory for static site
0. `yarn build:api` builds `collections, users tags and project.json` files in `dist/api/` directory from the Ouroboros API but without building the entire site. It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
0. `yarn build:site` builds `dist/collections`, `dist/recent`, `dist/users` and `dist/tags` resources.
It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
0. `yarn build:boards` to build `dist/boards`, `dist/api/boards` and `dist/api/discussions` resources.
0. `yarn build:subjects` builds `dist/api/subjects` and `dist/subjects` resources.

Alternatively run those scripts individually to build the API data in `.dist/api/` and HTML content in `dist/` and cache the API responses in `.cache`.

```
yarn deploy
```

Copy the site from `/dist` to S3.

## Run with Docker

Get a bash session in the container:
``` bash
docker-compose run --service-ports --rm talk-archiver bash
```
