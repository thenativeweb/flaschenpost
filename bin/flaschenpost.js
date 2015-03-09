#!/usr/bin/env node

'use strict';

var flaschenpost = require('../lib/flaschenpost');

flaschenpost.uncork(process.stdin, process.stdout);
