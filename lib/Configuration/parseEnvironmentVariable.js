'use strict';

const parseEnvironmentVariable = function () {
  /* eslint-disable no-process-env, newline-after-var */
  const logLevels = process.env.LOG_LEVELS;
  /* eslint-enable no-process-env, newline-after-var */

  if (!logLevels) {
    return [];
  }

  return logLevels.split(',').map(logLevel => {
    return logLevel.trim().toLowerCase();
  });
};

module.exports = parseEnvironmentVariable;
