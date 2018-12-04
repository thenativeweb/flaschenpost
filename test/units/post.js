'use strict';

const promisify = require('util.promisify');
const fs = require('fs');
const path = require('path');

const unlink = promisify(fs.unlink);

const post = async function () {
  const packageJson = path.join(__dirname, 'package.json');

  await unlink(packageJson);
};

module.exports = post;
