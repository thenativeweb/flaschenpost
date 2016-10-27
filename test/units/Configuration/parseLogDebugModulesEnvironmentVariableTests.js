'use strict';

const assert = require('assertthat'),
      nodeenv = require('nodeenv');

const parseLogDebugModulesEnvironmentVariable = require('../../../lib/Configuration/parseLogDebugModulesEnvironmentVariable');

suite('parseLogDebugModulesEnvironmentVariable', () => {
  test('is a function.', done => {
    assert.that(parseLogDebugModulesEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', done => {
    nodeenv('LOG_DEBUG_MODULES', undefined, restore => {
      assert.that(parseLogDebugModulesEnvironmentVariable()).is.undefined();

      restore();
      done();
    });
  });

  test('returns an array with a single value if the environment variable is set to a single value.', done => {
    nodeenv('LOG_DEBUG_MODULES', 'module1', restore => {
      assert.that(parseLogDebugModulesEnvironmentVariable()).is.equalTo([ 'module1' ]);

      restore();
      done();
    });
  });

  test('returns an array with multiple values.', done => {
    nodeenv('LOG_DEBUG_MODULES', 'module1,@scoped/module2', restore => {
      assert.that(parseLogDebugModulesEnvironmentVariable()).is.equalTo([ 'module1', '@scoped/module2' ]);

      restore();
      done();
    });
  });
});
