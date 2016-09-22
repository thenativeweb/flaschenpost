#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-env */
process.env.FLASCHENPOST_FORMATTER = 'json';
/* eslint-enable no-process-env */

const stream = require('stream');

const elasticsearch = require('elasticsearch'),
      processenv = require('processenv'),
      split2 = require('split2'),
      uuid = require('uuidv4');

const flaschenpost = require('../lib/flaschenpost');

const url = processenv('ELASTIC_URL') || 'localhost:9200';

const buffer = new stream.PassThrough({ objectMode: true }),
      logger = flaschenpost.getLogger();

process.stdin.pipe(split2()).on('data', data => {
  process.stdout.write(data);
  process.stdout.write('\n');

  const message = JSON.parse(data);

  buffer.write(message);
});

const client = new elasticsearch.Client({ host: url });

client.indices.create({ index: 'logs' }, errCreateIndex => {
  if (errCreateIndex && !errCreateIndex.message.includes('[index_already_exists_exception]')) {
    return logger.error(errCreateIndex.message, { err: errCreateIndex });
  }

  client.indices.putMapping({
    index: 'logs',
    type: 'message',
    body: {
      properties: {
        timestamp: { type: 'date' }
      }
    }
  }, errPutMapping => {
    if (errPutMapping) {
      return logger.error(errPutMapping.message, { err: errPutMapping });
    }

    buffer.on('data', message => {
      message['@timestamp'] = new Date(message.timestamp).toISOString();

      client.create({
        index: 'logs',
        type: 'message',
        id: uuid(),
        timestamp: message.timestamp,
        body: message
      }, errCreate => {
        if (errCreate) {
          return logger.error(errCreate.message, { err: errCreate });
        }
      });
    });
  });
});
