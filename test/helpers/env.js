'use strict';

/* eslint-disable no-process-env */
const env = {
  ELASTIC_URL: process.env.ELASTIC_URL || 'http://elastic:changeme@local.wolkenkit.io:9200'
};
/* eslint-enable no-process-env */

module.exports = env;
