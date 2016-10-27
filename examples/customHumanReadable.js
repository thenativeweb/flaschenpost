#!/usr/bin/env node
'use strict';

const flaschenpost = require('../lib/flaschenpost');
const logger = flaschenpost.getLogger();

/* eslint-disable no-process-env */
/* eslint-disable no-console */

Reflect.deleteProperty(process.env, 'FLASCHENPOST_HUMAN_FORMAT');

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('default', { meta: 123 });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %level %message %metadataShort';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('date/time level message');
logger.info('date/time level message', { meta: 123 });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %levelColored %message %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.debug('colored level', 1);
logger.info('colored level', 2);
logger.warn('colored level', 'warn');
logger.error('colored level', [ 1, 2, 3 ]);
logger.fatal('colored level', { key: 'value' });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %levelColored %messageColored %metadataShort';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.debug('colored level and message', 1);
logger.info('colored level and message', 2);
logger.warn('colored level and message', 'warn');
logger.error('colored level and message', [ 1, 2, 3 ]);
logger.fatal('colored level and message', { key: 'value' });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '[%date %time.%ms] (%application@%applicationVersion/%module@%moduleVersion) %level: %message (%source) %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('custom', { meta: 123 });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%messageColored (%levelColored)\n' +
  '%origin\n' +
  '%time.%ms@%date %pid#%id\n' +
  '%metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('nearly the default human format', { meta: 123 });
console.log();
