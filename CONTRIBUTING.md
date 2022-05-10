# Contributors Guide

## Setting up the dev environment

Make sure you have a recent version of Node and run:
```
npm install
```

## Testing

Run all tests:
```
npm run test
```

You can also run the [provided samples](./samples/README.md).

### Testing with the [Samples Repo](https://github.com/amberflo/metering-typescript-sample)

At the root of this repo, create a "link" to this repo (your development
version of the package). You may need `sudo`.
```
npm build
npm link
```

At the root of the samples repo, use the development version of your library:
```
npm install
npm link amberflo-metering-typescript
```

Then, set up the samples and run one of them:
```
node ./dist/sampleUsageSdk.js
```

It should use you development version of this library.

Note that you need to `npm run build` this library in order for your changes to
take effect.

## Linting & Checking

Lint the codebase:
```
npm run lint
```

Fix some lint errors automatically:
```
npm run fix
```

Check types:
```
npm run check
```

## Releasing

Releasing a new version is mostly automated by a Github action. It does require a few manual steps:

1. Bump the version number in `package.json`
2. Commit the change and give it a version tag:
```
git commit -m "vX.Y.Z"
git tag "vX.Y.Z"
```
3. Create a release in in [Github](https://github.com/amberflo/metering-typescript/releases). Once you publish it, the Github action will publish the package to NPM.

To build the release version:
```
npm run build
```
