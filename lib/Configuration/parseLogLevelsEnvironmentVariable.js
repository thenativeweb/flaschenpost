'use strict';

const parseLogLevelsEnvironmentVariable = function () {
  /* eslint-disable no-process-env, newline-after-var */
  const logLevels = process.env.LOG_LEVELS;
  /* eslint-enable no-process-env, newline-after-var */

  if (!logLevels) {
    return [];
  }

  return logLevels.split(',').map(logLevel => logLevel.trim().toLowerCase());
};

module.exports = parseLogLevelsEnvironmentVariable;
