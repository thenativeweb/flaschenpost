'use strict';

const assert = require('assertthat'),
    nodeenv = require('nodeenv');

const parseEnvironmentVariable = require('../../lib/Configuration/parseEnvironmentVariable');

suite('parseEnvironmentVariable', () => {
  test('is a function.', done => {
    assert.that(parseEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', done => {
    nodeenv('LOG_LEVELS', undefined, restore => {
      assert.that(parseEnvironmentVariable()).is.equalTo([]);

      restore();
      done();
    });
  });

  test('returns an array with a single value if the environment variable is set to a single value.', done => {
    nodeenv('LOG_LEVELS', 'info', restore => {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with a single lowercased and trimmed value.', done => {
    nodeenv('LOG_LEVELS', '  Info ', restore => {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with multiple values.', done => {
    nodeenv('LOG_LEVELS', '  Info , DEBUG  ,warN  ', restore => {
      assert.that(parseEnvironmentVariable()).is.equalTo([ 'info', 'debug', 'warn' ]);

      restore();
      done();
    });
  });
});
