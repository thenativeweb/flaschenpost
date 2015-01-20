'use strict';

var path = require('path');

var _ = require('lodash'),
    findRoot = require('find-root'),
    oboe = require('oboe'),
    stackTrace = require('stack-trace');

var Configuration = require('./Configuration'),
    FormatterHumanReadable = require('./formatters/HumanReadable'),
    FormatterJson = require('./formatters/Json'),
    letter = require('./letter'),
    Middleware = require('./Middleware');

var flaschenpost = {};

flaschenpost.initialize = function () {
  this.configuration = new Configuration();

  letter.unpipe();

  if (process.stdout.isTTY) {
    letter.pipe(new FormatterHumanReadable()).pipe(process.stdout);
  } else {
    letter.pipe(new FormatterJson()).pipe(process.stdout);
  }
};

flaschenpost.use = function (key, options) {
  this.configuration.set(key, options);
};

flaschenpost.getLogger = function (source) {
  var that = this;

  var logger = {},
      packageJson;

  if (!source) {
    source = stackTrace.get()[1].getFileName();
  }

  try {
    packageJson = require(path.join(findRoot(source), 'package.json'));
    that.configuration.module = {
      name: packageJson.name,
      version: packageJson.version
    };
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

flaschenpost.uncork = function (inputStream, outputStream) {
  var formatter = new FormatterHumanReadable();

  formatter.pipe(outputStream);

  oboe(inputStream).on('node', '!', function (node) {
    formatter.write(node);
    return oboe.drop;
  });
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
