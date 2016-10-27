#!/usr/bin/env node
'use strict';

const flaschenpost = require('../lib/flaschenpost');
const logger = flaschenpost.getLogger();

/* eslint-disable no-process-env */
/* eslint-disable no-console */

Reflect.deleteProperty(process.env, 'FLASCHENPOST_HUMAN_FORMAT');

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info(new Error('Something failed'));
console.log();

process.env.FLASCHENPOST_HUMAN_FORMAT = '%date %time %level %message';

logger.info(process.env.FLASCHENPOST_HUMAN_FORMAT);
logger.info(new Error('Something failed'));
console.log();
