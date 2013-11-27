'use strict';

var stream = require('stream'),
    util = require('util');

var chalk = require('chalk');

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

Console.prototype._write = function (chunk, encoding, callback) {
  console.log(colorize(chunk.level + ': ' + chunk.message, chunk.level, 'bold'));
  console.log(colorize(chunk.module + ' (' + chunk.uuid + ')', 'gray'));

  if (chunk.metadata) {
    console.log(colorize(JSON.stringify(chunk.metadata, null, '  '), 'gray'));
  }

  console.log(colorize(new Array(process.stdout.columns + 1).join('\u2500'), 'gray'));
  callback();
};

module.exports = Console;
