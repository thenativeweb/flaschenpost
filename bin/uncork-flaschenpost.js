#!/usr/bin/env node

'use strict';

var oboe = require('oboe');

var FormatterHumanReadable = require('../lib/formatters/HumanReadable'),
    paragraph = require('../lib/letter/paragraph');

var formatterHumanReadable = new FormatterHumanReadable();
formatterHumanReadable.pipe(process.stdout);

oboe(process.stdin).on('node', '!', function (node) {
  formatterHumanReadable.write(paragraph(node));
  return oboe.drop;
});
