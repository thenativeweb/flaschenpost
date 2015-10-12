'use strict';

const stream = require('stream'),
    util = require('util');

const stackTrace = require('stack-trace');

const Writable = stream.Writable;

const Middleware = function (level, source) {
  if (!level) {
    throw new Error('Level is missing.');
  }

  const flaschenpost = require('../flaschenpost');
  const options = {};

  options.objectMode = true;
  options.source = source || stackTrace.get()[1].getFileName();

  Writable.call(this, options);

  this.level = level;
  this.logger = flaschenpost.getLogger(options.source);

  if (!this.logger[this.level]) {
    throw new Error('Level is invalid.');
  }
};

util.inherits(Middleware, Writable);

/* eslint-disable no-underscore-dangle */
Middleware.prototype._write = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  this.logger[this.level](chunk);
  callback();
};

module.exports = Middleware;
