import fs from 'fs';
import { PackageJson } from './PackageJson';
import path from 'path';

const readPackageJson = function (directory: string): PackageJson {
  const packageJsonPath = path.join(directory, 'package.json');

  let name = '(unknown)',
      version = '(unknown)';

  try {
    /* eslint-disable no-sync */
    const data = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
    /* eslint-enable no-sync */

    const parsedData = JSON.parse(data);

    ({ name, version } = parsedData);
  } catch {
    // Intentionally ignore any errors.
  }

  return { name, version };
};

export { readPackageJson };
