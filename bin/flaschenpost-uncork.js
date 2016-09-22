#!/usr/bin/env node

'use strict';

const split2 = require('split2');

const FormatterHumanReadable = require('../lib/formatters/HumanReadable');

const formatter = new FormatterHumanReadable();

formatter.pipe(process.stdout);

process.stdin.pipe(split2()).on('data', data => {
  const message = JSON.parse(data);

  formatter.write(message);
});
