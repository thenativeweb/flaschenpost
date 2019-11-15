import { assert } from 'assertthat';
import path from 'path';
import { readPackageJson } from '../../lib/readPackageJson';

suite('readPackageJson', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(readPackageJson).is.ofType('function');
  });

  test('returns the name and the version of the module in the given directory.', async (): Promise<void> => {
    const directory = path.join(__dirname, '..', 'shared', 'packageJsonValid');
    const packageJson = readPackageJson(directory);

    assert.that(packageJson).is.equalTo({
      name: 'test',
      version: '1.0.0'
    });
  });

  test('returns unknown as name and version if no package.json exists in the given directory.', async (): Promise<void> => {
    const directory = path.join(__dirname, '..', 'shared', 'packageJsonMissing');
    const packageJson = readPackageJson(directory);

    assert.that(packageJson).is.equalTo({
      name: '(unknown)',
      version: '(unknown)'
    });
  });

  test('returns unknown as name and version if the package.json is malformed.', async (): Promise<void> => {
    const directory = path.join(__dirname, '..', 'shared', 'packageJsonMalformed');
    const packageJson = readPackageJson(directory);

    assert.that(packageJson).is.equalTo({
      name: '(unknown)',
      version: '(unknown)'
    });
  });
});
