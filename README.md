# Talk-archiver
A static site generator for old Ouroboros project Talk forums, based on elevenpack.

## Usage

```
yarn install
```

Install the dependencies.

```
yarn build:api
```

Run this to build the `src/site/api` directory from the Ouroboros API, without building the entire site. It can be very slow, as it fetches resources one at a time. API responses are cached in `.cache` for 30 days. This step also runs during `yarn build`. 

```
yarn dev
```

Build and start a development site on http://localhost:8080.

```
yarn build
```

Cache the API data from Ouroboros, then build the full site. Output will be in `/dist`.

```
yarn deploy
```

Copy the site from `/dist` to S3.

