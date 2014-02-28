'use strict';

// Turned the following line to a comment as memwatch can not be
// compiled on Rapsberry Pi apparently. Needs re-check at some
// later point in time. Please note that you need to put memwatch
// back into package.json as well, version used was 0.2.2.
// 2014-02-28

// var enableLeakDetection = require('./enableLeakDetection'),
var logger = require('./logger'),
    packageJson = require('../package.json'),
    targets = require('./targets');

var flaschenpost = {
  setupNode: function (node) {
    logger.use(node);
  },

  targets: targets,

  on: function (evt, callback) { logger.on(evt, callback); },
  once: function (evt, callback) { logger.once(evt, callback); },
  off: function (evt, callback) { logger.off(evt, callback); },
  pipe: function (writableStream) { logger.pipe(writableStream); },
  read: function () { return logger.read(); },

  getLogger: function (options) {
    if (!options.module) { throw new Error('module is missing.'); }
    if (!options.version) { throw new Error('version is missing.'); }

    options.module = options.module + '@' + options.version;

    var log = function (level, uuid, message, metadata) {
      if (!metadata) {
        if (!message || (typeof message === 'object')) {
          throw new Error('UUID is missing.');
        }
      }
      logger.write({ module: options.module, uuid: uuid, level: level, message: message, metadata: metadata });
    };

    return {
      fatal: function (uuid, message, metadata) { log('fatal', uuid, message, metadata); },
      error: function (uuid, message, metadata) { log('error', uuid, message, metadata); },
      warn: function (uuid, message, metadata) { log('warn', uuid, message, metadata); },
      info: function (uuid, message, metadata) { log('info', uuid, message, metadata); },
      debug: function (uuid, message, metadata) { log('debug', uuid, message, metadata); }
    };
  },

  middleware: function (options) {
    var middlewareLogger = this.getLogger({
      module: options.module,
      version: options.version
    });
    return {
      stream: {
        write: function (message) {
          middlewareLogger.info(options.uuid, message);
        }
      }
    };
  }
};

// enableLeakDetection(flaschenpost.getLogger({
//   module: 'flaschenpost',
//   version: packageJson.version
// }));

if (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development')) {
  flaschenpost.pipe(new flaschenpost.targets.Console());
}

module.exports = flaschenpost;
