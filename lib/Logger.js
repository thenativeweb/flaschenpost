'use strict';

var stream = require('stream'),
    util = require('util');

var hexaring = require('hexaring');

var sanitize = require('./sanitize');

var Transform = stream.Transform;

var Logger = function (options) {
  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  this.id = hexaring.minValue();
};

util.inherits(Logger, Transform);

Logger.prototype.use = function (node) {
  this.node = node;
};

Logger.prototype._transform = function (chunk, encoding, callback) {
  var result = {
    id: this.id,
    timestamp: new Date().getTime(),
    module: chunk.module,
    node: undefined,
    uuid: chunk.uuid,
    level: chunk.level,
    message: chunk.message,
    metadata: sanitize(chunk.metadata)
  };

  if (this.node) {
    result.node = {
      host: this.node.host,
      port: this.node.port,
      id: this.node.id
    };
  }

  this.push(result);

  this.id = hexaring.add(this.id, 1).result;
  callback();
};

module.exports = Logger;
