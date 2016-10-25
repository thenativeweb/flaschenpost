'use strict';

const stream = require('stream'),
      util = require('util');

const moment = require('moment'),
      stringifyObject = require('stringify-object');

const colorize = require('./colorize');

const Transform = stream.Transform;

const HumanReadable = function (options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [ options ]);
};

util.inherits(HumanReadable, Transform);

/* eslint-disable no-underscore-dangle */
HumanReadable.prototype._transform = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  const timestamp = moment.utc(chunk.timestamp);
  let origin = '',
      result = '';

  origin = `${chunk.host}`;
  if (chunk.application) {
    // Be backward compatible and allow to parse logs without application data
    origin += `::${chunk.application.name}@${chunk.application.version}`;
  }
  if (!chunk.application || chunk.application.name !== chunk.module.name) {
    // Do not print the same module information twice
    origin += `::${chunk.module.name}@${chunk.module.version}`;
  }
  if (chunk.source) {
    origin += ` (${chunk.source})`;
  }

  /* eslint-disable no-process-env */
  if (process.env.FLASCHENPOST_HUMAN_FORMAT) {
//    console.log(process.env.FLASCHENPOST_HUMAN_FORMAT.split(/(%\w+(?::\w+)?)/g));
    process.env.FLASCHENPOST_HUMAN_FORMAT.split(/(%\w+)/g).forEach(item => {
    /* eslint-enable no-process-env */
      switch (item) {
        case '%application':
          result += chunk.application.name;
          break;

        case '%applicationVersion':
          result += chunk.application.version;
          break;

        case '%date':
          result += timestamp.format('YYYY-MM-DD');
          break;

        case '%host':
          result += chunk.host;
          break;

        case '%id':
          result += chunk.id;
          break;

        case '%coloredLevel':
          result += colorize(chunk.level, chunk.level, 'bold');
          break;

        case '%level':
          result += chunk.level;
          break;

        case '%coloredMessage':
          result += colorize(chunk.message, chunk.level, 'bold');
          break;

        case '%message':
          result += chunk.message;
          break;

        case '%metadata':
          if (chunk.metadata) {
            result += JSON.stringify(chunk.metadata);
          }
          break;

        case '%module':
          result += chunk.module.name;
          break;

        case '%moduleVersion':
          result += chunk.module.version;
          break;

        case '%ms':
          result += timestamp.format('SSS');
          break;

        case '%pid':
          result += chunk.pid;
          break;

        case '%source':
          result += chunk.source;
          break;

        case '%time':
          result += timestamp.format('HH:mm:ss');
          break;

        default:
          if (/^%/.test(item)) {
            throw new Error(`Unhandled custom parameter '${item}'`);
          }
          result += item;
          break;
      }
    });
  } else {
    result += colorize(`${chunk.message} (${chunk.level})`, chunk.level, 'bold');
    result += '\n';
    result += colorize(origin, 'white');
    result += '\n';
    /* eslint-disable max-len */
    result += colorize(`${timestamp.format('HH:mm:ss.SSS')}@${timestamp.format('YYYY-MM-DD')} ${chunk.pid}#${chunk.id}`, 'gray');
    /* eslint-enable max-len */
    result += '\n';
    if (chunk.metadata) {
      result += colorize(stringifyObject(chunk.metadata, {
        indent: '  ',
        singleQuotes: true
      }).replace(/\\n/g, '\n'), 'gray');
      result += '\n';
    }
    result += colorize('\u2500'.repeat(process.stdout.columns || 80), 'gray');
  }

  result += '\n';

  this.push(result);
  callback();
};

module.exports = HumanReadable;
