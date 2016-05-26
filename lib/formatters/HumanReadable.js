'use strict';

const stream = require('stream'),
      util = require('util');

const moment = require('moment'),
      stringifyObject = require('stringify-object');

const colorize = require('./colorize');

const Transform = stream.Transform;

const HumanReadable = function (options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [ options ]);
};

util.inherits(HumanReadable, Transform);

/* eslint-disable no-underscore-dangle */
HumanReadable.prototype._transform = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  const timestamp = moment.utc(chunk.timestamp);
  let result = '';

  result += colorize(`${chunk.message} (${chunk.level})`, 'bold');
  result += '\n';
  result += colorize(`${chunk.host}::${chunk.module.name}@${chunk.module.version}`, 'white');
  if (chunk.source) {
    result += colorize(` (${chunk.source})`, 'white');
  }
  result += '\n';
  /* eslint-disable max-len */
  result += colorize(`${timestamp.format('HH:mm:ss.SSS')}@${timestamp.format('YYYY-MM-DD')} ${chunk.pid}#${chunk.id}`, 'gray');
  /* eslint-enable max-len */
  result += '\n';
  if (chunk.metadata) {
    result += colorize(stringifyObject(chunk.metadata, {
      indent: '  ',
      singleQuotes: true
    }).replace(/\\n/g, '\n'), 'gray');
    result += '\n';
  }
  result += colorize('\u2500'.repeat(process.stdout.columns || 80), 'gray');
  result += '\n';

  this.push(result);
  callback();
};

module.exports = HumanReadable;
