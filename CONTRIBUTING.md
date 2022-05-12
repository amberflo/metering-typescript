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

We follow [semantic versioning](https://semver.org/).

Releasing a new version is mostly automated by a Github action. It does require a few manual steps:

1. Bump the version number in `package.json`
2. Commit the change and give it a version tag:
```
git commit -m "vX.Y.Z"
git tag "vX.Y.Z"
```
3. Push and then create a release in [Github](https://github.com/amberflo/metering-typescript/releases). Once you publish it, the Github action will publish the package to NPM.

To build the release version:
```
npm run build
```

## Testing the release build

The sample code references the library using `../src`, which is not how it's
gonna be used in a "real-project".

To test in a more "real-project" setting using the samples, you can create a
package and use `npm link` to link to the "development release".

1. At the root of this repo, create the release build:
```
npm run build
```

2. At the root of this repo, create a "link" to this repo (your development
version of the package). You may need `sudo` on the second command.
```
npm link
```

3. Change to the `samples` folder and make the samples use the built library
   instead of the source code.
```
cd ./samples
sed -i -e 's|\.\./src|amberflo-metering-typescript|' *.ts
echo '{}' > package.json
npm install --save amberflo-metering-typescript ts-node
npm link amberflo-metering-typescript
```

4. Run a sample
```
npx ts-node <sample-script>
```

Make sure to not commit the changes from **3.**.

Note that you need to `npm run build` this library in order for your changes to
the source code to take effect.
