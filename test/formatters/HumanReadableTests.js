'use strict';

var stream = require('stream');

var assert = require('assertthat'),
    chalk = require('chalk');

var HumanReadable = require('../../lib/formatters/HumanReadable');

var Transform = stream.Transform;

suite('HumanReadable', function () {
  var humanReadable;

  suiteSetup(function () {
    chalk.enabled = true;
    humanReadable = new HumanReadable();
  });

  test('is a transform stream.', function (done) {
    assert.that(humanReadable).is.instanceOf(Transform);
    done();
  });

  test('transforms a paragraph to a human-readable string.', function (done) {
    var paragraph = {
      pid: 82517,
      id: 0,
      timestamp: 1415024939974,
      level: 'info',
      message: 'App started.',
      module: {
        name: 'foo',
        version: '0.0.1'
      },
      source: 'app.js',
      metadata: {
        foo: 'bar'
      }
    };

    humanReadable.once('data', function (data) {
      assert.that(chalk.stripColor(data)).is.equalTo([
        /*eslint-disable nodeca/indent*/
        'App started. (info)',
        'foo@0.0.1 (app.js)',
        '14:28:59.974@2014-11-03 82517#0',
        '{',
        '  foo: \'bar\'',
        '}',
        new Array((process.stdout.columns || 80) + 1).join('\u2500') + '\n'
        /*eslint-enable nodeca/indent*/
      ].join('\n'));
      done();
    });

    humanReadable.write(paragraph);
  });
});
