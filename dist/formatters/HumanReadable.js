'use strict';

var stream = require('stream'),
    util = require('util');

var moment = require('moment'),
    stringifyObject = require('stringify-object');

var colorize = require('./colorize');

var Transform = stream.Transform;

var HumanReadable = function HumanReadable(options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [options]);
};

util.inherits(HumanReadable, Transform);

/* eslint-disable no-underscore-dangle */
HumanReadable.prototype._transform = function (chunk, encoding, callback) {
  /* eslint-enable no-underscore-dangle */
  var timestamp = moment.utc(chunk.timestamp);
  var origin = '',
      result = '';

  origin = '' + chunk.host;
  if (chunk.application) {
    // Be backward compatible and allow to parse logs without application data
    origin += '::' + chunk.application.name + '@' + chunk.application.version;
  }
  if (!chunk.application || chunk.application.name !== chunk.module.name) {
    // Do not print the same module information twice
    origin += '::' + chunk.module.name + '@' + chunk.module.version;
  }
  if (chunk.source) {
    origin += ' (' + chunk.source + ')';
  }

  result += colorize(chunk.message + ' (' + chunk.level + ')', chunk.level, 'bold');
  result += '\n';
  result += colorize(origin, 'white');
  result += '\n';
  result += colorize(timestamp.format('HH:mm:ss.SSS') + '@' + timestamp.format('YYYY-MM-DD') + ' ' + chunk.pid + '#' + chunk.id, 'gray');
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