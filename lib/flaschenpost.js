'use strict';

const _ = require('lodash'),
      appRootPath = require('app-root-path'),
      findRoot = require('find-root'),
      processenv = require('processenv'),
      split2 = require('split2'),
      stackTrace = require('stack-trace');

const Configuration = require('./Configuration'),
      FormatterGelf = require('./formatters/Gelf'),
      FormatterHumanReadable = require('./formatters/HumanReadable'),
      FormatterJson = require('./formatters/Json'),
      letter = require('./letter'),
      Middleware = require('./Middleware'),
      Paragraph = require('./letter/Paragraph'),
      readPackageJson = require('./readPackageJson');

const flaschenpost = {};

flaschenpost.initialize = function () {
  this.configuration = new Configuration();

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

  this.configuration.process = readPackageJson(appRootPath.path);
  logger.module = readPackageJson(findRoot(source));

  _.forOwn(this.configuration.levels, (levelOptions, levelName) => {
    if (!levelOptions.enabled) {
      logger[levelName] = () => {
        // Do nothing, as the log level is disabled.
      };

      return;
    }

    logger[levelName] = (message, metadata) => {
      if (!message) {
        throw new Error('Message is missing.');
      }
      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      letter.write({
        host: this.configuration.host,
        process: this.configuration.process,
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

flaschenpost.uncork = function (inputStream, outputStream) {
  const formatter = new FormatterHumanReadable();

  formatter.pipe(outputStream);

  inputStream.pipe(split2()).on('data', data => {
    let node,
        position = 0;

    do {
      try {
        node = JSON.parse(data.substr(position));
      } catch (ex) {
        position = data.indexOf('{', position + 1);
        if (position === -1) {
          node = new Paragraph(-1, {
            host: 'n/a',
            process: { name: 'n/a', version: 'n/a' },
            module: { name: 'n/a', version: 'n/a' },
            level: 'info',
            message: data
          });
          break;
        }
      }
    } while (typeof node !== 'object');

    formatter.write(node);
  });
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
