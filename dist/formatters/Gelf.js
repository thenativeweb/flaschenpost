'use strict';

var Transform = require('stream').Transform;
var util = require('util');

var Gelf = function Gelf(options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [options]);

  this.predefinedKeys = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file'];

  this.mappedKeys = {
    message: 'short_message'
  };

  this.defaultValues = {
    version: '1.1'
  };
};

util.inherits(Gelf, Transform);

/* eslint-disable no-underscore-dangle */
Gelf.prototype._transform = function (chunk, encoding, callback) {
  var _this = this;

  /* eslint-enable no-underscore-dangle */
  var result = Object.assign({}, this.defaultValues);

  Object.keys(chunk).forEach(function (key) {
    var mappedKey = void 0;

    if (_this.predefinedKeys.includes(key)) {
      mappedKey = key;
    } else if (_this.mappedKeys[key]) {
      mappedKey = _this.mappedKeys[key];
    } else {
      mappedKey = '_' + key;
    }

    result[mappedKey] = chunk[key];
  });

  this.push(JSON.stringify(result));
  callback();
};

module.exports = Gelf;