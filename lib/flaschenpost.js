'use strict';

const path = require('path');

const _ = require('lodash'),
    findRoot = require('find-root'),
    oboe = require('oboe'),
    stackTrace = require('stack-trace');

const Configuration = require('./Configuration'),
    FormatterHumanReadable = require('./formatters/HumanReadable'),
    FormatterJson = require('./formatters/Json'),
    letter = require('./letter'),
    Middleware = require('./Middleware');

const flaschenpost = {};

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
  if (!source) {
    source = stackTrace.get()[1].getFileName();
  }

  try {
    const packageJson = require(path.join(findRoot(source), 'package.json'));

    this.configuration.module = {
      name: packageJson.name,
      version: packageJson.version
    };
  } catch (e) {
    throw new Error('Could not find package.json.');
  }

  const logger = {};

  _.forOwn(this.configuration.levels, (levelOptions, levelName) => {
    if (!levelOptions.enabled) {
      logger[levelName] = () => {};
      return;
    }

    logger[levelName] = (message, metadata) => {
      if (!message) {
        throw new Error('Message is missing.');
      }
      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      letter.write({ module: this.configuration.module, source, level: levelName, message, metadata });
    };
  });

  return logger;
};

flaschenpost.uncork = function (inputStream, outputStream) {
  const formatter = new FormatterHumanReadable();

  formatter.pipe(outputStream);

  oboe(inputStream).on('node', '!', node => {
    formatter.write(node);
    return oboe.drop;
  });
};

flaschenpost.Middleware = Middleware;

flaschenpost.initialize();

module.exports = flaschenpost;
