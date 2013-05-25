'use strict';

var util = require('util');

var winston = require('winston');

var TestTransport = winston.transports.TestTransport = function (callback) {
  this.callback = callback;
  this.level = 'debug';
};
util.inherits(TestTransport, winston.Transport);

TestTransport.prototype.name = 'testTransport';
TestTransport.prototype.log = function (level, message, metadata, callback) {
  this.callback(level, message, metadata, callback);
};

module.exports = TestTransport;