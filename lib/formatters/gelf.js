'use strict';

const Transform = require('stream').Transform;
const util = require('util');

const Gelf = function (options) {
  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  // Default keys based on GELF 2.0 - http://docs.graylog.org/en/2.0/pages/gelf.html
  this.gelfStandardKeys = {
    version: true,
    host: true,
    short_message: true, // eslint-disable-line camelcase
    full_message: true, // eslint-disable-line camelcase
    timestamp: true,
    level: true,
    facility: true,
    line: true,
    file: true
  };
};

util.inherits(Gelf, Transform);

Gelf.prototype._transform = function (chunk, encoding, callback) { // eslint-disable-line no-underscore-dangle
  const result = {};

  for (const key in chunk) {
    if (this.gelfStandardKeys[key]) {
      result[key] = chunk[key];
    } else {
      // Non-standard keys must be prefixed
      result['_' + key] = chunk[key];
    }
  }

  this.push(JSON.stringify(result));
  callback();
};

module.exports = Gelf;
