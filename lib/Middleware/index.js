'use strict';

var stream = require('stream'),
    util = require('util');

var Writable = stream.Writable;

var Middleware = function (level, options) {
  var flaschenpost = require('../flaschenpost');

  if (!level) {
    throw new Error('Level is missing.');
  }

  options = options || {};
  options.objectMode = true;
  options.source = options.source || 'express';

  Writable.call(this, options);

  this.level = level;
  this.logger = flaschenpost.getLogger(options.source);

  if (!this.logger[this.level]) {
    throw new Error('Level is invalid.');
  }
};

util.inherits(Middleware, Writable);

/*eslint-disable no-underscore-dangle*/
Middleware.prototype._write = function (chunk, encoding, callback) {
/*eslint-enable no-underscore-dangle*/
  this.logger[this.level](chunk);
  callback();
};

module.exports = Middleware;
