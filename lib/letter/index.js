'use strict';

const stream = require('stream'),
    util = require('util');

const sanitizeMetadata = require('./sanitizeMetadata');

const Transform = stream.Transform;

const Letter = function (options) {
  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  this.id = 0;
};

util.inherits(Letter, Transform);

/* eslint-disable no-underscore-dangle */
Letter.prototype._transform = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  const paragraph = {
    pid: process.pid,
    id: this.id,
    timestamp: new Date().getTime(),
    level: chunk.level,
    message: chunk.message
  };

  if (chunk.module) {
    paragraph.module = chunk.module;
  }
  if (chunk.source) {
    paragraph.source = chunk.source;
  }
  if (chunk.metadata) {
    paragraph.metadata = sanitizeMetadata(chunk.metadata);
  }

  this.push(paragraph);

  this.id++;
  callback();
};

module.exports = new Letter();
