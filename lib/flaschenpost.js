'use strict';

const _ = require('lodash'),
      appRootPath = require('app-root-path'),
      findRoot = require('find-root'),
      processenv = require('processenv'),
      stackTrace = require('stack-trace');

const Configuration = require('./Configuration'),
      FormatterGelf = require('./formatters/Gelf'),
      FormatterHumanReadable = require('./formatters/HumanReadable'),
      FormatterJson = require('./formatters/Json'),
      letter = require('./letter'),
      Middleware = require('./Middleware'),
      readPackageJson = require('./readPackageJson');

const flaschenpost = {};

flaschenpost.initialize = function () {
  this.configuration = new Configuration();
  this.configuration.application = readPackageJson(appRootPath.path);

  letter.unpipe();

  const requestedFormatter =
    processenv('FLASCHENPOST_FORMATTER') ||
    (process.stdout.isTTY ? 'human' : 'json');

  let formatter;

  switch (requestedFormatter) {
    case 'gelf':
      formatter = new FormatterGelf();
      break;
    case 'human':
      formatter = new FormatterHumanReadable();
      break;
    case 'json':
      formatter = new FormatterJson();
      break;
    default:
      throw new Error('Unsupported formatter.');
  }

  letter.pipe(formatter).pipe(process.stdout);
};

flaschenpost.use = function (key, options) {
  this.configuration.set(key, options);
};

flaschenpost.getLogger = function (source) {
  if (!source) {
    source = stackTrace.get()[1].getFileName();
  }

  const logger = {};

  logger.module = readPackageJson(findRoot(source));

  _.forOwn(this.configuration.levels, (levelOptions, levelName) => {
    if (!levelOptions.enabled) {
      logger[levelName] = () => {
        // Do nothing, as the log level is disabled.
      };

      return;
    }

    logger[levelName] = (message, metadata) => {
      if (typeof message !== 'string') {
        try {
          message = JSON.stringify(message);
        } catch (err) {
          throw new Error('Failed to stringify message.');
        }
      }

      letter.write({
        host: this.configuration.host,
        application: this.configuration.application,
        module: logger.module,
        source,
        level: levelName,
        message,
        metadata
      });
    };
  });

  return logger;
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
