'use strict';

var isError = require('./isError');

var sanitize = function (metadata) {
  if (isError(metadata)) {
    return {
      name: metadata.name,
      code: metadata.code,
      message: metadata.message,
      stack: metadata.stack
    };
  }

  var key;
  for (key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      if (typeof metadata[key] === 'object') {
        metadata[key] = sanitize(metadata[key]);
      }
    }
  }

  return metadata;
};

module.exports = sanitize;
