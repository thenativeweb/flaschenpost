'use strict';

const util = require('util');

const _ = require('lodash');

const sanitizeArray = function (metadata) {
  const result = [];

  for (let i = 0; i < metadata.length; i++) {
    const value = metadata[i];

    if (typeof value === 'object') {
      /* eslint-disable no-use-before-define */
      result[i] = sanitizeMetadata(value);
      /* eslint-enable no-use-before-define */
      continue;
    }
    result[i] = value;
  }

  return result;
};

const sanitizeObject = function (metadata) {
  const result = {};

  _.forOwn(metadata, (value, key) => {
    if (typeof value === 'object') {
      /* eslint-disable no-use-before-define */
      result[key] = sanitizeMetadata(value);
      /* eslint-enable no-use-before-define */
      return;
    }
    result[key] = value;
  });

  return result;
};

const sanitizeError = function (metadata) {
  return JSON.parse(JSON.stringify(metadata, Object.getOwnPropertyNames(metadata).concat('name')));
};

const sanitizeMetadata = function (metadata) {
  if (util.isError(metadata)) {
    return sanitizeError(metadata);
  }
  if (util.isArray(metadata)) {
    return sanitizeArray(metadata);
  }

  return sanitizeObject(metadata);
};

module.exports = sanitizeMetadata;
