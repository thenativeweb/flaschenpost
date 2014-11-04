'use strict';

var stream = require('stream'),
    util = require('util');

var mark = require('markup-js');

var sanitizeMetadata = require('./sanitizeMetadata');

var Transform = stream.Transform;

var Letter = function (options) {
  options = options || {};
  options.objectMode = true;

  Transform.call(this, options);

  this.id = 0;
};

util.inherits(Letter, Transform);

/*eslint-disable no-underscore-dangle*/
Letter.prototype._transform = function (chunk, encoding, callback) {
/*eslint-enable no-underscore-dangle*/
  var paragraph = {
    id: this.id,
    timestamp: new Date().getTime(),
    level: chunk.level,
    message: mark.up(chunk.message, chunk.data)
  };

  if (chunk.module) {
    paragraph.module = chunk.module;
  }

  if (chunk.source) {
    paragraph.source = chunk.source;
  }

  if (chunk.data && chunk.data.metadata) {
    paragraph.metadata = sanitizeMetadata(chunk.data.metadata);
  }

  this.push(paragraph);

  this.id++;
  callback();
};

module.exports = new Letter();
