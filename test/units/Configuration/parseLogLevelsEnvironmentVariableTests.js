'use strict';

const assert = require('assertthat'),
      nodeenv = require('nodeenv');

const parseLogLevelsEnvironmentVariable = require('../../../lib/Configuration/parseLogLevelsEnvironmentVariable');

suite('parseLogLevelsEnvironmentVariable', () => {
  test('is a function.', done => {
    assert.that(parseLogLevelsEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', done => {
    nodeenv('LOG_LEVELS', undefined, restore => {
      assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([]);

      restore();
      done();
    });
  });

  /* eslint-disable max-len */
  test('returns an array with a single value if the environment variable is set to a single value.', done => {
    /* eslint-enable max-len */
    nodeenv('LOG_LEVELS', 'info', restore => {
      assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with a single lowercased and trimmed value.', done => {
    nodeenv('LOG_LEVELS', '  Info ', restore => {
      assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info' ]);

      restore();
      done();
    });
  });

  test('returns an array with multiple values.', done => {
    nodeenv('LOG_LEVELS', '  Info , DEBUG  ,warN  ', restore => {
      assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info', 'debug', 'warn' ]);

      restore();
      done();
    });
  });
});
