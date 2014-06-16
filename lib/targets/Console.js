'use strict';

var stream = require('stream'),
    util = require('util');

var chalk = require('chalk'),
    moment = require('moment');

var Writable = stream.Writable;

var Console = function (options) {
  options = options || {};
  options.objectMode = true;

  Writable.call(this, options);
};

util.inherits(Console, Writable);

var toColor = function (colorOrLevel) {
  var map = {
    fatal: 'blue',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'white'
  };

  if (map[colorOrLevel]) {
    return map[colorOrLevel];
  }
  return colorOrLevel;
};

var colorize = function (text, level, style) {
  var result = chalk[toColor(level)](text);
  if (style) {
    result = chalk[style](result);
  }
  return result;
};

/*eslint-disable no-underscore-dangle*/
Console.prototype._write = function (chunk, encoding, callback) {
  /*eslint-enable no-underscore-dangle*/
  var timestamp = moment(chunk.timestamp);

  /*eslint-disable no-console*/
  console.log(colorize(chunk.message + ' (' + chunk.level + ')', chunk.level, 'bold'));
  console.log(colorize(chunk.module + ' (' + chunk.uuid + ')', 'white'));

  if (chunk.node) {
    console.log(colorize(chunk.node.host + ':' + chunk.node.port + ' (' + chunk.node.id + ')', 'gray'));
  }
  console.log(colorize(timestamp.format('HH:mm:ss.SSS') + '@' + timestamp.format('DD.MM.YYYY') + ' (' + chunk.id + ')', 'gray'));

  if (chunk.metadata) {
    console.log(colorize(JSON.stringify(chunk.metadata, null, '  '), 'gray'));
  }

  console.log(colorize(new Array(process.stdout.columns + 1).join('\u2500'), 'gray'));
  /*eslint-enable no-console*/
  callback();
};

module.exports = Console;
