'use strict';

var _ = require('underscore'),
    winston = require('winston');

var logger = new winston.Logger({
  levels: {
    fatal: 4,
    error: 3,
    warn: 2,
    info: 1,
    debug: 0
  }
});
winston.config.addColors({
  fatal: 'blue',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'grey'
});

if (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development')) {
  logger.add(winston.transports.Console, { level: 'debug' });
  logger.transports.console.colorize = true;
}

var host,
    id = 0;

var looksLikeAnError = function (object) {
  return _.isObject(object) && object.name && object.message;
};

var behavesLikeES5Error =  function (object) {
  return !object.propertyIsEnumerable('name') && !object.propertyIsEnumerable('message');
};

var isError = function (object) {
  return looksLikeAnError(object) && behavesLikeES5Error(object);
};

var transformErrors = function (metadata) {
  if (isError(metadata)) {
    return {
      name: metadata.name,
      code: metadata.code,
      message: metadata.message,
      stack: metadata.stack
    };
  }

  for (var key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      if (typeof metadata[key] === 'object') {
        metadata[key] = transformErrors(metadata[key]);
      }
    }
  }

  return metadata;
};

var log = function (module, level, uuid, message, metadata) {
  if (!metadata) {
    if (!message || (typeof message === 'object')) {
      throw new Error('uuid is missing.');
    }
  }

  metadata = transformErrors(metadata);

  if (!host) {
    return logger.log(level, JSON.stringify({
      id: id++,
      timestamp: new Date(),
      module: module,
      uuid: uuid,
      level: level,
      message: message,
      metadata: metadata
    }));
  }

  logger.log(level, JSON.stringify({
    id: id++,
    timestamp: new Date(),
    module: module,
    node: { host: host.host, port: host.port, id: host.id },
    uuid: uuid,
    level: level,
    message: message,
    metadata: metadata
  }));
};

var flaschenpost = {
  setupNode: function (node) {
    host = node;
  },

  add: function (transport, options) {
    logger.add(transport, options);
  },

  remove: function (transport) {
    logger.remove(transport);
  },

  getLogger: function (options) {
    return {
      fatal: function (uuid, message, metadata) { log(options.module, 'fatal', uuid, message, metadata); },
      error: function (uuid, message, metadata) { log(options.module, 'error', uuid, message, metadata); },
      warn: function (uuid, message, metadata) { log(options.module, 'warn', uuid, message, metadata); },
      info: function (uuid, message, metadata) { log(options.module, 'info', uuid, message, metadata); },
      debug: function (uuid, message, metadata) { log(options.module, 'debug', uuid, message, metadata); }
    };
  }
};

module.exports = flaschenpost;