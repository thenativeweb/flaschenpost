'use strict';

var enableLeakDetection = require('./enableLeakDetection'),
    logger = require('./logger'),
    packageJson = require('../package.json');

// if (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development')) {
  // Enable console logger
// }

var flaschenpost = {
  setupNode: function (node) {
    logger.use(node);
  },

  on: function (evt, callback) { logger.on(evt, callback); },
  once: function (evt, callback) { logger.once(evt, callback); },
  off: function (evt, callback) { logger.off(evt, callback); },
  pipe: function (writableStream) { logger.pipe(writableStream); },
  unpipe: function (writableStream) { logger.unpipe(writableStream); },
  read: function () { return logger.read(); },

  getLogger: function (options) {
    if (!options.module) { throw new Error('module is missing.'); }
    if (!options.version) { throw new Error('version is missing.'); }

    options.module = options.module + '@' + options.version;

    return {
      log: function (level, uuid, message, metadata) {
        if (!metadata) {
          if (!message || (typeof message === 'object')) {
            throw new Error('UUID is missing.');
          }
        }
        logger.write({ module: options.module, uuid: uuid, level: level, message: message, metadata: metadata });
      },
      fatal: function (uuid, message, metadata) { this.log('fatal', uuid, message, metadata); },
      error: function (uuid, message, metadata) { this.log('error', uuid, message, metadata); },
      warn: function (uuid, message, metadata) { this.log('warn', uuid, message, metadata); },
      info: function (uuid, message, metadata) { this.log('info', uuid, message, metadata); },
      debug: function (uuid, message, metadata) { this.log('debug', uuid, message, metadata); }
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

enableLeakDetection(flaschenpost.getLogger({
  module: 'flaschenpost',
  version: packageJson.version
}));

module.exports = flaschenpost;
