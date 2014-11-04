'use strict';

var _ = require('lodash'),
    varname = require('varname');

var defaultLevels = require('../defaultLevels.json'),
    defaultModule = require('../defaultModule.json'),
    parseEnvironmentVariable = require('./parseEnvironmentVariable');

var Configuration = function () {
  this.setLevels(_.cloneDeep(defaultLevels));
  this.setModule(_.cloneDeep(defaultModule));
};

Configuration.prototype.set = function (key, options) {
  var fn = varname.camelback('set-' + key);

  if (!this[fn]) {
    throw new Error('Unknown key \'' + key + '\' specified.');
  }

  this[fn](options);
};

Configuration.prototype.setLevels = function (levels) {
  var enabledLogLevels = parseEnvironmentVariable();

  if (!levels) {
    throw new Error('Levels are missing.');
  }

  this.levels = levels;

  if (enabledLogLevels.length === 0) {
    return;
  }

  _.forOwn(this.levels, function (levelOptions, levelName) {
    levelOptions.enabled = _.contains(enabledLogLevels, levelName);
  });
};

Configuration.prototype.setModule = function (module) {
  if (!module) {
    throw new Error('Module is missing.');
  }

  if (!module.name) {
    throw new Error('Module name is missing.');
  }

  if (!module.version) {
    throw new Error('Module version is missing.');
  }

  this.module = {
    name: module.name,
    version: module.version
  };
};

module.exports = Configuration;
