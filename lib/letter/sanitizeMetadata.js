'use strict';

var util = require('util');

var _ = require('lodash');

var sanitizeMetadata = function (metadata) {
  if (util.isError(metadata)) {
    return JSON.parse(JSON.stringify(metadata, Object.getOwnPropertyNames(metadata).concat('name')));
  }

  _.forOwn(metadata, function (value, key) {
    if (typeof value === 'object') {
      metadata[key] = sanitizeMetadata(value);
    }
  });

  return metadata;
};

module.exports = sanitizeMetadata;
