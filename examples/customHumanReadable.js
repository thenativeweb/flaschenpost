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

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %level %message %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('rawConsole');
logger.info('rawConsole', { meta: 123 });
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %coloredLevel %message %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.debug('rawConsole', 1);
logger.info('rawConsole');
logger.warn('rawConsole');
logger.error('rawConsole');
logger.fatal('rawConsole');
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %coloredLevel %coloredMessage %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.debug('rawConsole');
logger.info('rawConsole');
logger.warn('rawConsole');
logger.error('rawConsole');
logger.fatal('rawConsole');
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '[%date %time.%ms] (%application@%applicationVersion/%module@%moduleVersion) %level: %message (%source) %metadata';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info('custom', { meta: 123 });
console.log();
