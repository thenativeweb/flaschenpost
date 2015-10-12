'use strict';

const _ = require('lodash'),
    varname = require('varname');

const defaultLevels = require('../defaultLevels.json'),
    parseEnvironmentVariable = require('./parseEnvironmentVariable');

const Configuration = function () {
  this.setLevels(_.cloneDeep(defaultLevels));
};

Configuration.prototype.set = function (key, options) {
  const fn = varname.camelback(`set-${key}`);

  if (!this[fn]) {
    throw new Error(`Unknown key '${key}' specified.`);
  }

  this[fn](options);
};

Configuration.prototype.setLevels = function (levels) {
  if (!levels) {
    throw new Error('Levels are missing.');
  }

  this.levels = levels;

  let enabledLogLevels = parseEnvironmentVariable();

  if (enabledLogLevels.length === 0) {
    return;
  }

  if (enabledLogLevels.length === 1 && enabledLogLevels[0] === '*') {
    enabledLogLevels = _.keys(this.levels);
  }

  _.forEach(enabledLogLevels, enabledLogLevel => {
    if (!_.contains(_.keys(this.levels), enabledLogLevel)) {
      throw new Error(`Unknown log level ${enabledLogLevel}.`);
    }
  });

  _.forOwn(this.levels, (levelOptions, levelName) => {
    levelOptions.enabled = _.contains(enabledLogLevels, levelName);
  });
};

module.exports = Configuration;
