'use strict';

var _ = require('lodash');

var objectFrom = function objectFrom(data, isGiven) {
  if (!isGiven) {
    return;
  }
  if (_.isObject(data) && !_.isArray(data) && data !== null) {
    return data;
  }

  return { value: data };
};

module.exports = objectFrom;