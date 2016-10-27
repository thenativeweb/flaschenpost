'use strict';

const parseLogDebugModulesEnvironmentVariable = function () {
  /* eslint-disable no-process-env, newline-after-var */
  const logDebugModules = process.env.LOG_DEBUG_MODULES;
  /* eslint-enable no-process-env, newline-after-var */

  if (!logDebugModules) {
    return undefined;
  }

  return logDebugModules.split(',');
};

module.exports = parseLogDebugModulesEnvironmentVariable;
