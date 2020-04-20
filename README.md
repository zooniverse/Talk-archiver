# Talk-archiver
A static site generator for old Ouroboros project Talk forums, based on elevenpack.

## Usage

```
yarn install
```

Install the dependencies.

```
yarn build:data
```

Run this to build the `src/site/_data` directory from the Ouroboros API. It can be very slow, as it fetches resources one at a time. Run this once to avoid having to rebuild the site data on every development build.

```
yarn dev
```

Build and start a development site on http://localhost:8080. Make sure that the site data directory has been build first.

```
yarn build
```

Build the full site. Output will be in `/dist`.

