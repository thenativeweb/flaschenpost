'use strict';

var assert = require('assertthat'),
    nodeenv = require('nodeenv');

var parseEnvironmentVariable = require('../../lib/Configuration/parseEnvironmentVariable');

suite('parseEnvironmentVariable', function () {
  test('is a function.', function (done) {
    assert.that(parseEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', function (done) {
    nodeenv('LOG_LEVELS', undefined, function (restore) {
      assert.that(parseEnvironmentVariable()).is.equalTo([]);

      restore();
      done();
    });
  });

  test('returns an array with a single value if the environment variable is set to a single value.', function (done) {
    nodeenv('LOG_LEVELS', 'info', function (restore) {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with a single lowercased and trimmed value.', function (done) {
    nodeenv('LOG_LEVELS', '  Info ', function (restore) {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with multiple values.', function (done) {
    nodeenv('LOG_LEVELS', '  Info , DEBUG  ,warN  ', function (restore) {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info', 'debug', 'warn' ]);

      restore();
      done();
    });
  });
});
