'use strict';

var assert = require('node-assertthat'),
    nodeenv = require('nodeenv'),
    sinon = require('sinon');

var Configuration = require('../../lib/Configuration'),
    defaultLevels = require('../../lib/defaultLevels.json'),
    defaultModule = require('../../lib/defaultModule.json');

suite('Configuration', function () {
  test('is a function.', function (done) {
    assert.that(Configuration, is.ofType('function'));
    done();
  });

  test('returns an object.', function (done) {
    assert.that(new Configuration(), is.ofType('object'));
    done();
  });

  suite('module', function () {
    test('is an object.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.module, is.ofType('object'));
      done();
    });

    test('contains the default module information.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.module, is.equalTo(defaultModule));
      done();
    });
  });

  suite('levels', function () {
    test('is an object.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.levels, is.ofType('object'));
      done();
    });

    test('contains the default levels.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.levels, is.equalTo(defaultLevels));
      done();
    });
  });

  suite('set', function () {
    test('is a function.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.set, is.ofType('function'));
      done();
    });

    test('throws an error when an unknown key is specified.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.set('foo');
      }, is.throwing('Unknown key \'foo\' specified.'));
      done();
    });

    test('calls the appropriate setX function.', function (done) {
      var configuration = new Configuration(),
          spy = sinon.spy(configuration, 'setModule');

      var expected = {
        name: 'foo',
        version: '0.0.1'
      };

      configuration.set('module', expected);

      assert.that(spy.calledOnce, is.true());
      assert.that(spy.calledWith(expected), is.true());

      configuration.setModule.restore();
      done();
    });
  });

  suite('setLevels', function () {
    test('is a function.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.setLevels, is.ofType('function'));
      done();
    });

    test('throws an error if levels are missing.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.setLevels();
      }, is.throwing('Levels are missing.'));
      done();
    });

    test('sets the given levels.', function (done) {
      var expected = {
        info: {
          color: 'green',
          stream: 'stdout',
          enabled: true
        }
      };

      var configuration = new Configuration();
      configuration.setLevels(expected);

      assert.that(configuration.levels, is.equalTo(expected));
      done();
    });

    test('sets the given levels with respect to the LOG_LEVELS environment variable.', function (done) {
      nodeenv('LOG_LEVELS', 'debug', function (restore) {
        var input = {
          debug: {
            color: 'green',
            stream: 'stdout',
            enabled: false
          }
        };

        var expected = {
          debug: {
            color: 'green',
            stream: 'stdout',
            enabled: true
          }
        };

        var configuration = new Configuration();
        configuration.setLevels(input);

        assert.that(configuration.levels, is.equalTo(expected));
        restore();
        done();
      });
    });
  });

  suite('setModule', function () {
    test('is a function.', function (done) {
      var configuration = new Configuration();
      assert.that(configuration.setModule, is.ofType('function'));
      done();
    });

    test('throws an error if module is missing.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.setModule();
      }, is.throwing('Module is missing.'));
      done();
    });

    test('throws an error if module name is missing.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.setModule({ version: '0.0.1' });
      }, is.throwing('Module name is missing.'));
      done();
    });

    test('throws an error if module version is missing.', function (done) {
      var configuration = new Configuration();
      assert.that(function () {
        configuration.setModule({ name: 'foo' });
      }, is.throwing('Module version is missing.'));
      done();
    });

    test('sets the given module.', function (done) {
      var expected = {
        name: 'foo',
        version: '0.0.1'
      };

      var configuration = new Configuration();
      configuration.setModule(expected);

      assert.that(configuration.module, is.equalTo(expected));
      done();
    });

    test('ignores additional values.', function (done) {
      var expected = {
        name: 'foo',
        version: '0.0.1'
      };

      var input = {
        name: 'foo',
        description: 'The ultimate foo module.',
        version: '0.0.1'
      };

      var configuration = new Configuration();
      configuration.setModule(input);

      assert.that(configuration.module, is.equalTo(expected));
      done();
    });
  });
});
