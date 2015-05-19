'use strict';

var util = require('util');

var _ = require('lodash');

var sanitizeArray = function (metadata) {
  var i,
      result = [],
      value;

  for (i = 0; i < metadata.length; i++) {
    value = metadata[i];
    if (typeof value === 'object') {
      /*eslint-disable no-use-before-define*/
      result[i] = sanitizeMetadata(value);
      /*eslint-enable no-use-before-define*/
      continue;
    }
    result[i] = value;
  }

  return result;
};

var sanitizeObject = function (metadata) {
  var result = {};

  _.forOwn(metadata, function (value, key) {
    if (typeof value === 'object') {
      /*eslint-disable no-use-before-define*/
      result[key] = sanitizeMetadata(value);
      /*eslint-enable no-use-before-define*/
      return;
    }
    result[key] = value;
  });

  return result;
};

var sanitizeError = function (metadata) {
  return JSON.parse(JSON.stringify(metadata, Object.getOwnPropertyNames(metadata).concat('name')));
};

var sanitizeMetadata = function (metadata) {
  if (util.isError(metadata)) {
    return sanitizeError(metadata);
  }

  if (util.isArray(metadata)) {
    return sanitizeArray(metadata);
  }

  return sanitizeObject(metadata);
};

module.exports = sanitizeMetadata;
