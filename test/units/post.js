'use strict';

const fs = require('fs'),
      path = require('path');

const post = function (done) {
  const packageJson = path.join(__dirname, 'package.json');

  fs.unlink(packageJson, done);
};

module.exports = post;
