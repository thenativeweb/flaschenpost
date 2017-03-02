'use strict';

var _ = require('lodash'),
    appRootPath = require('app-root-path'),
    findRoot = require('find-root'),
    processenv = require('processenv'),
    stackTrace = require('stack-trace');

var Configuration = require('./Configuration'),
    FormatterCustom = require('./formatters/Custom'),
    FormatterGelf = require('./formatters/Gelf'),
    FormatterHumanReadable = require('./formatters/HumanReadable'),
    FormatterJson = require('./formatters/Json'),
    letter = require('./letter'),
    Middleware = require('./Middleware'),
    objectFrom = require('./objectFrom'),
    readPackageJson = require('./readPackageJson');

var flaschenpost = {};

flaschenpost.initialize = function () {
  this.configuration = new Configuration();
  this.configuration.application = readPackageJson(appRootPath.path);

  letter.unpipe();

  var requestedFormatter = processenv('FLASCHENPOST_FORMATTER') || (process.stdout.isTTY ? 'human' : 'json');

  var formatter = void 0;

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
  var _this = this;

  if (!source) {
    source = stackTrace.get()[1].getFileName();
  }

  var logger = {};

  logger.module = readPackageJson(findRoot(source));

  _.forOwn(this.configuration.levels, function (levelOptions, levelName) {
    if (!levelOptions.enabled) {
      logger[levelName] = function () {
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
        source: source,
        level: levelName,
        message: message,
        metadata: metadata
      });
    }.bind(_this);

    var debugToBeWrapped = logger.debug;

    logger.debug = function (message, metadata) {
      if (this.configuration.debugModules.length > 0 && !this.configuration.debugModules.includes(logger.module.name)) {
        return;
      }

      if (arguments.length === 2) {
        debugToBeWrapped(message, metadata);
      } else {
        debugToBeWrapped(message);
      }
    }.bind(_this);
  });

  return logger;
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;