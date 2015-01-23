'use strict';

var util = require('util');

var chalk = require('chalk'),
    charSpinner = require('char-spinner'),
    mark = require('markup-js');

var pad = require('./pad'),
    unicode = require('./unicode');

var isVerbose = function () {
  return process.argv.indexOf('--verbose') !== -1;
};

var isQuiet = function () {
  return process.argv.indexOf('--quiet') !== -1;
};

var cli = {};

cli.fail = function (message, options) {
  options = options || {};

  /*eslint-disable no-console*/
  console.error(chalk.red.bold(util.format('%s %s', options.prefix || unicode.crossMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

cli.warn = function (message, options) {
  options = options || {};

  /*eslint-disable no-console*/
  console.error(chalk.yellow.bold(util.format('%s %s', options.prefix || unicode.rightPointingPointer, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

cli.success = function (message, options) {
  options = options || {};

  if (isQuiet()) {
    return;
  }

  /*eslint-disable no-console*/
  console.log(chalk.green.bold(util.format('%s %s', options.prefix || unicode.checkMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

cli.info = function (message, options) {
  options = options || {};

  if (isQuiet()) {
    return;
  }

  /*eslint-disable no-console*/
  console.log(chalk.white(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

cli.verbose = function (message, options) {
  options = options || {};

  if (isQuiet() || !isVerbose()) {
    return;
  }

  /*eslint-disable no-console*/
  console.log(chalk.gray(util.format('%s %s', options.prefix || ' ', mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

cli.list = function (message, options) {
  var width;

  options = options || {};
  options.indent = options.indent || 0;
  options.prefix = options.prefix || unicode.multiplicationDot;

  width = options.indent * (options.prefix.length + 1);
  options.prefix = new Array(width + 1).join(' ') + options.prefix;

  return cli.info(message, options);
};

cli.table = function (rows) {
  var widths = [];

  if (!rows) {
    throw new Error('Rows are missing.');
  }

  rows.forEach(function (row) {
    row.forEach(function (value, columnIndex) {
      widths[columnIndex] = Math.max(widths[columnIndex] || 0, ('' + value).length);
    });
  });

  rows.forEach(function (row) {
    var line = [];

    if (row.length > 0) {
      row.forEach(function (value, columnIndex) {
        line.push(pad(value, widths[columnIndex]));
      });
    } else {
      widths.forEach(function (width) {
        line.push(new Array(width + 1).join(unicode.boxDrawingsLightHorizontal));
      });
    }

    cli.info(line.join('  '));
  });
};

cli.blankLine = function () {
  if (isQuiet()) {
    return;
  }

  /*eslint-disable no-console*/
  console.log();
  /*eslint-enable no-console*/
};

cli.waitFor = function (worker) {
  var spinner;

  if (!worker) {
    throw new Error('Worker is missing.');
  }

  if (isQuiet()) {
    return worker(function () {});
  }

  spinner = charSpinner();

  worker(function () {
    clearInterval(spinner);
  });
};

module.exports = cli;
