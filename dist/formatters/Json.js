'use strict';

var stream = require('stream'),
    util = require('util');

var Transform = stream.Transform;

var Json = function Json(options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [options]);
};

util.inherits(Json, Transform);

/* eslint-disable no-underscore-dangle */
Json.prototype._transform = function (chunk, encoding, callback) {
  /* eslint-enable no-underscore-dangle */
  this.push(JSON.stringify(chunk) + '\n');
  callback();
};

module.exports = Json;