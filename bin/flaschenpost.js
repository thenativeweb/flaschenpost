#!/usr/bin/env node

'use strict';

var updateNotifier = require('update-notifier');

var flaschenpost = require('../lib/flaschenpost'),
    packageJson = require('../package.json');

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

flaschenpost.uncork(process.stdin, process.stdout);
