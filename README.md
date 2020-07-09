# Talk-archiver
A static site generator for old Ouroboros project Talk forums, based on [elevenpack](https://github.com/deviousdodo/elevenpack).

## Usage

```
yarn install
```

Install the dependencies.

```
yarn dev talk.sciencegossip.org
```

Use this script for local development.

Build and start a development site on http://localhost:8080.

This will run all `dev:*` scripts from `package.json` in parallel to build the HTML & JSON resources. API responses are cached in `.cache/` for 30 days using [`eleventy-cache-assets`](https://github.com/11ty/eleventy-cache-assets).

```
yarn dev:boards talk.sciencegossip.org
```

Build development versions of `dist/boards`, `dist/api/boards` and `dist/api/discussions` then run a local Browsersync server. Useful if you want to test a build on `http://localhost:8080` without cleaning the `dist/` directory first.

```
yarn build talk.sciencegossip.org
```
Use this script to create resource pages prior to deploying. API responses are cached in `.cache/` for 30 days using [`eleventy-cache-assets`](https://github.com/11ty/eleventy-cache-assets).

Will run the following build scripts in order:

1. `yarn build:assets` to build the `dist/assets/` directory for static site.
1. `yarn build:boards` to build `dist/boards`, `dist/api/boards` and `dist/api/discussions` resources.
1. `yarn build:api` builds `collections`, `users` and `project.json` files in `dist/api/`.
1. `yarn build:site` builds `dist/collections`, `dist/recent`, and `dist/users` pages.
1. `yarn build:tags` builds JSON files in `dist/api/tags` and HTML pages in `dist/tags`.
1. `yarn build:subjects-api` builds `dist/api/subjects` JSON files.
1. `yarn build:subjects` builds `dist/subjects` index pages.
1. `yarn build:subjectCollections` builds `dist/subjects` collection pages (the full list of collections for each subject.)

Alternatively run those scripts individually to build the API data in `dist/api/` and HTML content in `dist/` and cache the API responses in `.cache`.

```
yarn deploy -r talk.sciencegossip.org
```

Copy the site from `/dist` to S3.

## Run with Docker

Get a bash session in the container to develop or deploy resources:

``` bash
docker-compose run --service-ports --rm talk-archiver bash
# build the relevant talk resources and serve them via http://localhost:8080
yarn dev

# or build
yarn build
# and deploy the resources
yarn deploy
```

## Debugging performance

Set the `DEBUG` environment variable to [debug performance](https://www.11ty.dev/docs/debugging/).
```
DEBUG=Eleventy:Benchmark* yarn build talk.sciencegossip.org
```