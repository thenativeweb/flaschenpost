'use strict';

var assert = require('assertthat'),
    nodeenv = require('nodeenv'),
    sinon = require('sinon');

var Configuration = require('../../lib/Configuration'),
    defaultLevels = require('../../lib/defaultLevels.json');

suite('Configuration', function () {
  test('is a function.', function (done) {
    assert.that(Configuration).is.ofType('function');
    done();
  });

  test('returns an object.', function (done) {
    assert.that(new Configuration()).is.ofType('object');
    done();
  });

  suite('module', function () {
    test('does not exist by default.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.module).is.undefined();
      done();
    });
  });

  suite('levels', function () {
    test('is an object.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.levels).is.ofType('object');
      done();
    });

    test('contains the default levels.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.levels).is.equalTo(defaultLevels);
      done();
    });
  });

  suite('set', function () {
    test('is a function.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.set).is.ofType('function');
      done();
    });

    test('throws an error when an unknown key is specified.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.set('foo');
      }).is.throwing('Unknown key \'foo\' specified.');
      done();
    });

    test('calls the appropriate setX function.', function (done) {
      var configuration = new Configuration(),
          spy = sinon.spy(configuration, 'setLevels');

      var expected = {
        info: {
          color: 'green',
          enabled: true
        }
      };

      configuration.set('levels', expected);

      assert.that(spy.calledOnce).is.true();
      assert.that(spy.calledWith(expected)).is.true();

      configuration.setLevels.restore();
      done();
    });
  });

  suite('setLevels', function () {
    test('is a function.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.setLevels).is.ofType('function');
      done();
    });

    test('throws an error if levels are missing.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.setLevels();
      }).is.throwing('Levels are missing.');
      done();
    });

    test('sets the given levels.', function (done) {
      var expected = {
        info: {
          color: 'green',
          enabled: true
        }
      };

      var configuration = new Configuration();
      configuration.setLevels(expected);

      assert.that(configuration.levels).is.equalTo(expected);
      done();
    });

    test('sets the given levels with respect to the LOG_LEVELS environment variable.', function (done) {
      nodeenv('LOG_LEVELS', 'debug', function (restore) {
        var input = {
          debug: {
            color: 'green',
            enabled: false
          }
        };

        var expected = {
          debug: {
            color: 'green',
            enabled: true
          }
        };

        var configuration = new Configuration();
        configuration.setLevels(input);

        assert.that(configuration.levels).is.equalTo(expected);
        restore();
        done();
      });
    });

    test('throws an error if an unknown level is provided by the LOG_LEVELS environment variable.', function (done) {
      nodeenv('LOG_LEVELS', 'foobar', function (restore) {
        assert.that(function () {
          /*eslint-disable no-new*/
          new Configuration();
          /*eslint-enable no-new*/
        }).is.throwing('Unknown log level foobar.');

        restore();
        done();
      });
    });

    test('sets all levels if the LOG_LEVELS environment variable contains a \'*\'.', function (done) {
      nodeenv('LOG_LEVELS', '*', function (restore) {
        var input = {
          debug: {
            color: 'green',
            enabled: false
          },
          info: {
            color: 'white',
            enabled: false
          }
        };

        var expected = {
          debug: {
            color: 'green',
            enabled: true
          },
          info: {
            color: 'white',
            enabled: true
          }
        };

        var configuration = new Configuration();
        configuration.setLevels(input);

        assert.that(configuration.levels).is.equalTo(expected);
        restore();
        done();
      });
    });
  });
});
