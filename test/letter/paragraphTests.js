'use strict';

var assert = require('node-assertthat');

var paragraph = require('../../lib/letter/paragraph');

suite('paragraph', function () {
  test('is a function.', function (done) {
    assert.that(paragraph, is.ofType('function'));
    done();
  });

  test('does not alter an already existing paragraph.', function (done) {
    var expected = {
      id: 0,
      timestamp: 1415108953558,
      level: 'info',
      message: 'App started.',
      module: {
        name: 'foo',
        version: '0.0.1'
      },
      metadata: {
        foo: 'bar',
        err: {
          name: 'Error',
          code: undefined,
          message: 'foobar',
          stack: [ 'Error: foobar',
          '    at Context.<anonymous> (/flaschenpost/test/letter/paragraphTests.js:22:16)',
          '    at Test.Runnable.run (/flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runnable.js:217:15)',
          '    at Runner.runTest (/flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:373:10)',
          '    at /flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:451:12)',
          '    at next (/flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:298:14)',
          '    at /flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:308:7)',
          '    at next (/flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:246:23)',
          '    at Object._onImmediate (/flaschenpost/node_modules/tourism/node_modules/grunt-mocha-cli/node_modules/mocha/lib/runner.js:275:5)',
          '    at processImmediate [as _immediateCallback] (timers.js:345:15)' ].join('\n')
        }
      }
    };

    var actual = paragraph(expected);

    assert.that(actual, is.equalTo(expected));
    done();
  });

  test('returns a paragraph with a formatted message when data is given.', function (done) {
    var input = {
      level: 'info',
      message: 'App {{foo}} started.',
      data: {
        foo: 'bar'
      },
      module: {
        name: 'foo',
        version: '0.0.1'
      }
    };

    var expected = 'App bar started.';
    var actual = paragraph(input);

    assert.that(actual.message, is.equalTo(expected));
    done();
  });

  test('returns a paragraph with source information if they are given.', function (done) {
    var input = {
      level: 'info',
      message: 'App started.',
      source: __filename,
      module: {
        name: 'foo',
        version: '0.0.1'
      }
    };

    var actual = paragraph(input);
    assert.that(actual.source, is.equalTo(input.source));
    done();
  });

  test('returns a paragraph with metadata if they are given.', function (done) {
    var input = {
      level: 'info',
      message: 'App started.',
      data: {
        metadata: {
          foo: 'bar'
        }
      },
      module: {
        name: 'foo',
        version: '0.0.1'
      }
    };

    var actual = paragraph(input);
    assert.that(actual.metadata, is.equalTo(input.data.metadata));
    done();
  });

  test('returns a paragraph with metadata with correctly transformed error objects.', function (done) {
    var input = {
      level: 'info',
      message: 'App started.',
      data: {
        metadata: {
          foo: 'bar',
          err: new Error('foobar')
        }
      },
      module: {
        name: 'foo',
        version: '0.0.1'
      }
    };

    var actual = paragraph(input);

    assert.that(actual.metadata.err, is.ofType('object'));
    assert.that(actual.metadata.err, is.not.instanceOf(Error));
    assert.that(actual.metadata.err.name, is.equalTo('Error'));
    assert.that(actual.metadata.err.message, is.equalTo('foobar'));
    assert.that(actual.metadata.err.stack, is.ofType('string'));
    done();
  });
});
