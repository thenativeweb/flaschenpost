'use strict';

var http = require('http'),
    util = require('util');

var winston = require('winston');

var SchleuseTransport = winston.transports.SchleuseTransport = function (options) {
  this.level = options.level || 'debug';

  this.host = options.host;
  this.port = options.port;
};

util.inherits(SchleuseTransport, winston.Transport);

SchleuseTransport.prototype.name = 'schleuseTransport';

SchleuseTransport.prototype.log = function (level, message, metadata, callback) {
  var req = http.request({
    host: this.host,
    port: this.port,
    path: '/log',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, function (res) {
    res.resume();
    callback(null, true);
  }).on('error', function () {});

  req.write(message);
  req.end();
};

module.exports = SchleuseTransport;