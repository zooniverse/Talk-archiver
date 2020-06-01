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

Use this script for local development.

Build and start a development site on http://localhost:8080.

This will run all `dev:*` scripts from `package.json` in parallel to build the HTML & JSON resources. It will also cache the API request data in `.cache`.

```
yarn build
```
Use this script to create resource pages prior to deploying.

Will run the following build scripts in order:

1. `yarn build:assets` to build the `dist/assets/` directory for static site
2. `yarn build:api` builds `collections, users tags and project.json` files in `dist/api/` directory from the Ouroboros API but without building the entire site. It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
3. `yarn build:site` builds `dist/collections`, `dist/recent`, `dist/users` and `dist/tags` resources.
It can be very slow on first run, as it fetches resources one at a time. API responses are cached in `.cache/` for 30 days.
4. `yarn build:boards` to build `dist/boards`, `dist/api/boards` and `dist/api/discussions` resources.
5. `yarn build:subjects` builds `dist/api/subjects` and `dist/subjects` resources.

Alternatively run those scripts individually to build the API data in `.dist/api/` and HTML content in `dist/` and cache the API responses in `.cache`.

```
yarn deploy
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
