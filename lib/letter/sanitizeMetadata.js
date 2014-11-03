'use strict';

var util = require('util');

var _ = require('lodash');

var sanitizeMetadata = function (metadata) {
  if (util.isError(metadata)) {
    return {
      name: metadata.name,
      code: metadata.code,
      message: metadata.message,
      stack: metadata.stack
    };
  }

  _.forOwn(metadata, function (value, key) {
    if (typeof value === 'object') {
      metadata[key] = sanitizeMetadata(value);
    }
  });

  return metadata;
};

module.exports = sanitizeMetadata;
