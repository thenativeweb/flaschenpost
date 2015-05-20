'use strict';

var parseEnvironmentVariable = function () {
  /*eslint-disable no-process-env, newline-after-var*/
  var logLevels = process.env.LOG_LEVELS;
  /*eslint-enable no-process-env, newline-after-var*/

  if (!logLevels) {
    return [];
  }

  return logLevels.split(',').map(function (logLevel) {
    return logLevel.trim().toLowerCase();
  });
};

module.exports = parseEnvironmentVariable;
