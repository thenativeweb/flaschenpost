'use strict';

var _ = require('lodash');

var Configuration = require('./Configuration'),
    letter = require('./letter');

var flaschenpost = {};

flaschenpost.initialize = function () {
  this.configuration = new Configuration();
};

flaschenpost.use = function (key, options) {
  this.configuration.set(key, options);
};

flaschenpost.getLogger = function (file) {
  var that = this;

  var logger = {};

  _.forOwn(that.configuration.levels, function (levelOptions, levelName) {
    if (!levelOptions.enabled) {
      logger[levelName] = function () {};
      return;
    }

    logger[levelName] = function (message, data) {
      var blueprint;

      if (!message) {
        throw new Error('Message is missing.');
      }

      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      blueprint = {
        module: that.configuration.module,
        file: file,
        level: levelName,
        message: message,
        data: data
      };

      letter.write(blueprint);
    };
  });

  return logger;
};

flaschenpost.initialize();

module.exports = flaschenpost;
