'use strict';

var memwatch = require('memwatch');

var enableLeakDetection = function (logger) {
  memwatch.on('stats', function (statistics) {
    logger.info('5dbe04c7-1bd4-4eb7-bc34-e9bc846fd196', 'gathered memory usage statistics.', statistics);
  });

  memwatch.on('leak', function (info) {
    logger.warn('3f0c75d2-bbe9-4c16-9539-e70f3b6ad323', 'detected a potential memory leak.', info);
  });
};

module.exports = enableLeakDetection;
