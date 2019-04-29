'use strict';

const fs = require('fs'),
      path = require('path'),
      { promisify } = require('util');

const unlink = promisify(fs.unlink);

const post = async function () {
  const packageJson = path.join(__dirname, 'package.json');

  await unlink(packageJson);
};

module.exports = post;
