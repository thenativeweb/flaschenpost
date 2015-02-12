'use strict';

var util = require('util');

var _ = require('lodash');

var sanitizeMetadata = function (metadata) {
  var result;

  if (util.isError(metadata)) {
    return JSON.parse(JSON.stringify(metadata, Object.getOwnPropertyNames(metadata).concat('name')));
  }

  result = {};

  _.forOwn(metadata, function (value, key) {
    if (typeof value === 'object') {
      result[key] = sanitizeMetadata(value);
      return;
    }

    result[key] = value;
  });

  return result;
};

module.exports = sanitizeMetadata;
