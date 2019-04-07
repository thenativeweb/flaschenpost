'use strict';

const cloneDeepWith = require('lodash/cloneDeepWith'),
      isError = require('lodash/isError'),
      serializeError = require('serialize-error');

const sanitizeMetadata = function (metadata) {
  const cloner = function (value) {
    if (isError(value)) {
      return serializeError(value);
    }

    return undefined;
  };

  return cloneDeepWith(metadata, cloner);
};

module.exports = sanitizeMetadata;
