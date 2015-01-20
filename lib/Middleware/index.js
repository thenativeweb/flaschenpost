'use strict';

var stream = require('stream'),
    util = require('util');

var stackTrace = require('stack-trace');

var Writable = stream.Writable;

var Middleware = function (level, source) {
  var flaschenpost = require('../flaschenpost');
  var options;

  if (!level) {
    throw new Error('Level is missing.');
  }

  options = {};
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

/*eslint-disable no-underscore-dangle*/
Middleware.prototype._write = function (chunk, encoding, callback) {
/*eslint-enable no-underscore-dangle*/
  this.logger[this.level](chunk);
  callback();
};

module.exports = Middleware;
