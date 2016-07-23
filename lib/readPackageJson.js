'use strict';

const path = require('path');

const readPackageJson = function (packagePath) {
  try {
    /* eslint-disable global-require */
    const packageJson = require(path.join(packagePath, 'package.json'));
    /* eslint-enable global-require */

    return {
      name: packageJson.name,
      version: packageJson.version
    };
  } catch (ex) {
    throw new Error(`Could not find package.json.`);
  }
};

module.exports = readPackageJson;
