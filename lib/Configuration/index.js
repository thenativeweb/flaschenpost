'use strict';

var _ = require('lodash'),
    varname = require('varname');

var defaultLevels = require('../defaultLevels.json'),
    parseEnvironmentVariable = require('./parseEnvironmentVariable');

var Configuration = function () {
  this.setLevels(_.cloneDeep(defaultLevels));
};

Configuration.prototype.set = function (key, options) {
  var fn = varname.camelback('set-' + key);

  if (!this[fn]) {
    throw new Error('Unknown key \'' + key + '\' specified.');
  }

  this[fn](options);
};

Configuration.prototype.setLevels = function (levels) {
  var that = this;

  var enabledLogLevels = parseEnvironmentVariable();

  if (!levels) {
    throw new Error('Levels are missing.');
  }

  that.levels = levels;

  if (enabledLogLevels.length === 0) {
    return;
  }

  if (enabledLogLevels.length === 1 && enabledLogLevels[0] === '*') {
    enabledLogLevels = _.keys(that.levels);
  }

  _.forEach(enabledLogLevels, function (enabledLogLevel) {
    if (!_.contains(_.keys(that.levels), enabledLogLevel)) {
      throw new Error('Unknown log level ' + enabledLogLevel + '.');
    }
  });

  _.forOwn(that.levels, function (levelOptions, levelName) {
    levelOptions.enabled = _.contains(enabledLogLevels, levelName);
  });
};

module.exports = Configuration;
