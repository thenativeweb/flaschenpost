'use strict';

const stream = require('stream'),
      util = require('util');

const untildify = require('untildify');

const Transform = stream.Transform;

let format;

const Custom = function (options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.js) {
    throw new Error('JavaScript is missing.');
  }

  /* eslint-disable global-require */
  format = require(untildify(options.js));
  /* eslint-enable global-require */

  options.objectMode = true;

  Reflect.apply(Transform, this, [ options ]);
};

util.inherits(Custom, Transform);

/* eslint-disable no-underscore-dangle */
Custom.prototype._transform = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  const result = format(chunk);

  this.push(result);
  callback();
};

module.exports = Custom;
