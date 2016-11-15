'use strict';

const path = require('path');

const fs = require('fs-extra');

const pre = function (done) {
  const packageJson = path.join(__dirname, 'package.json'),
        packageJsonTemplate = path.join(__dirname, '_package.json');

  fs.copy(packageJsonTemplate, packageJson, done);
};

module.exports = pre;
