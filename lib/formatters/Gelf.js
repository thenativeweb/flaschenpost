'use strict';

const Transform = require('stream').Transform;
const util = require('util');

const Gelf = function (options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [ options ]);

  this.predefinedKeys = [
    'version', 'host', 'short_message', 'full_message',
    'timestamp', 'level', 'facility', 'line', 'file'
  ];

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
  /* eslint-enable no-underscore-dangle */
  const result = Object.assign({}, this.defaultValues);

  Object.keys(chunk).forEach(key => {
    let mappedKey;

    if (this.predefinedKeys.includes(key)) {
      mappedKey = key;
    } else if (this.mappedKeys[key]) {
      mappedKey = this.mappedKeys[key];
    } else {
      mappedKey = `_${key}`;
    }

    result[mappedKey] = chunk[key];
  });

  this.push(JSON.stringify(result));
  callback();
};

module.exports = Gelf;
