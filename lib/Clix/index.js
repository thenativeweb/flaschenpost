'use strict';

var util = require('util');

var chalk = require('chalk'),
    mark = require('markup-js');

var unicode = require('./unicode');

var Cli = function () {};

Cli.prototype.blankLine = function () {
  /*eslint-disable no-console*/
  console.log();
  /*eslint-enable no-console*/
};

Cli.prototype.success = function (message, options) {
  /*eslint-disable no-console*/
  console.log(chalk.green.bold(util.format('%s %s', unicode.checkMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

Cli.prototype.error = function (message, options) {
  /*eslint-disable no-console*/
  console.error(chalk.red.bold(util.format('%s %s', unicode.crossMark, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

Cli.prototype.warn = function (message, options) {
  /*eslint-disable no-console*/
  console.error(chalk.yellow.bold(util.format('%s %s', unicode.rightPointingPointer, mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

Cli.prototype.info = function (message, options) {
  /*eslint-disable no-console*/
  console.log(chalk.white(util.format('  %s', mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

Cli.prototype.verbose = function (message, options) {
  /*eslint-disable no-console*/
  console.log(chalk.gray(util.format('  %s', mark.up(message + '', options))));
  /*eslint-enable no-console*/
};

module.exports = Cli;
