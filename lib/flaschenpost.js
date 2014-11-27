'use strict';

var path = require('path');

var _ = require('lodash'),
    findRoot = require('find-root');

var Configuration = require('./Configuration'),
    FormatterHumanReadable = require('./formatters/HumanReadable'),
    FormatterJson = require('./formatters/Json'),
    letter = require('./letter'),
    Middleware = require('./Middleware');

var flaschenpost = {},
    formatterHumanReadable,
    formatterJson;

flaschenpost.initialize = function () {
  this.configuration = new Configuration();

  letter.unpipe();

  if (formatterHumanReadable) {
    formatterHumanReadable.unpipe();
    formatterHumanReadable = undefined;
  }
  if (formatterJson) {
    formatterJson.unpipe();
    formatterJson = undefined;
  }

  if (process.stdout.isTTY) {
    formatterHumanReadable = new FormatterHumanReadable();
    letter.pipe(formatterHumanReadable).pipe(process.stdout);
  } else {
    formatterJson = new FormatterJson();
    letter.pipe(formatterJson).pipe(process.stdout);
  }
};

flaschenpost.use = function (key, options) {
  this.configuration.set(key, options);
};

flaschenpost.getLogger = function (source) {
  var that = this;

  var logger = {};

  if (!source) {
    throw new Error('Source is missing.');
  }

  try {
    that.configuration.module = require(path.join(findRoot(source), 'package.json'));
  } catch (e) {
    throw new Error('Could not find package.json.');
  }

  _.forOwn(that.configuration.levels, function (levelOptions, levelName) {
    if (!levelOptions.enabled) {
      logger[levelName] = function () {};
      return;
    }

    logger[levelName] = function (message, metadata) {
      var blueprint;

      if (!message) {
        throw new Error('Message is missing.');
      }

      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      blueprint = {
        module: that.configuration.module,
        source: source,
        level: levelName,
        message: message,
        metadata: metadata
      };

      letter.write(blueprint);
    };
  });

  return logger;
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
