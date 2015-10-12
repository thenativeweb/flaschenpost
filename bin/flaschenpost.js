#!/usr/bin/env node

'use strict';

const updateNotifier = require('update-notifier');

const flaschenpost = require('../lib/flaschenpost'),
    packageJson = require('../package.json');

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

flaschenpost.uncork(process.stdin, process.stdout);
