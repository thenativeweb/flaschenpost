'use strict';

const _ = require('lodash'),
      appRoot = require('app-root-path'),
      findRoot = require('find-root'),
      processenv = require('processenv'),
      stackTrace = require('stack-trace');

const Configuration = require('./Configuration'),
      FormatterCustom = require('./formatters/Custom'),
      FormatterGelf = require('./formatters/Gelf'),
      FormatterHumanReadable = require('./formatters/HumanReadable'),
      FormatterJson = require('./formatters/Json'),
      letter = require('./letter'),
      Middleware = require('./Middleware'),
      objectFrom = require('./objectFrom'),
      readPackageJson = require('./readPackageJson');

const flaschenpost = {};

flaschenpost.initialize = function (options) {
  options = options || {};

  const appRootPath = options.appRootPath || appRoot.path;

  this.configuration = new Configuration();
  this.configuration.application = readPackageJson(appRootPath);

  letter.unpipe();

  const requestedFormatter =
    processenv('FLASCHENPOST_FORMATTER') ||
    (process.stdout.isTTY ? 'human' : 'json');

  let formatter;

  if (requestedFormatter === 'gelf') {
    formatter = new FormatterGelf();
  } else if (requestedFormatter === 'human') {
    formatter = new FormatterHumanReadable();
  } else if (requestedFormatter === 'json') {
    formatter = new FormatterJson();
  } else if (requestedFormatter.startsWith('js:')) {
    formatter = new FormatterCustom({ js: /^js:(.*)$/g.exec(requestedFormatter)[1] });
  } else {
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

    logger[levelName] = function (message, metadata) {
      if (!message) {
        throw new Error('Message is missing.');
      }
      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      metadata = objectFrom(metadata, arguments.length === 2);

      letter.write({
        host: this.configuration.host,
        application: this.configuration.application,
        module: logger.module,
        source,
        level: levelName,
        message,
        metadata
      });
    }.bind(this);

    const debugToBeWrapped = logger.debug;

    logger.debug = function (message, metadata) {
      if (
        this.configuration.debugModules.length > 0 &&
        !this.configuration.debugModules.includes(logger.module.name)
      ) {
        return;
      }

      if (arguments.length === 2) {
        debugToBeWrapped(message, metadata);
      } else {
        debugToBeWrapped(message);
      }
    }.bind(this);
  });

  return logger;
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
