'use strict';

var stream = require('stream'),
    util = require('util');

var paragraph = require('./paragraph');

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
  chunk.id = this.id;

  this.push(paragraph(chunk));

  this.id++;
  callback();
};

module.exports = new Letter();
