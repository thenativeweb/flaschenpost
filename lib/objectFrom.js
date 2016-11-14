'use strict';

const _ = require('lodash');

const objectFrom = function (data, isGiven) {
  if (!isGiven) {
    return;
  }
  if (_.isObject(data) && !_.isArray(data) && data !== null) {
    return data;
  }

  return { value: data };
};

module.exports = objectFrom;
