'use strict';

const assert = require('assertthat'),
    nodeenv = require('nodeenv'),
    sinon = require('sinon');

const Configuration = require('../../lib/Configuration'),
    defaultLevels = require('../../lib/defaultLevels.json');

suite('Configuration', () => {
  test('is a function.', done => {
    assert.that(Configuration).is.ofType('function');
    done();
  });

  test('returns an object.', done => {
    assert.that(new Configuration()).is.ofType('object');
    done();
  });

  suite('module', () => {
    test('does not exist by default.', done => {
      const configuration = new Configuration();

      assert.that(configuration.module).is.undefined();
      done();
    });
  });

  suite('levels', () => {
    test('is an object.', done => {
      const configuration = new Configuration();

      assert.that(configuration.levels).is.ofType('object');
      done();
    });

    test('contains the default levels.', done => {
      const configuration = new Configuration();

      assert.that(configuration.levels).is.equalTo(defaultLevels);
      done();
    });
  });

  suite('set', () => {
    test('is a function.', done => {
      const configuration = new Configuration();

      assert.that(configuration.set).is.ofType('function');
      done();
    });

    test('throws an error when an unknown key is specified.', done => {
      const configuration = new Configuration();

      assert.that(() => {
        configuration.set('foo');
      }).is.throwing('Unknown key \'foo\' specified.');
      done();
    });

    test('calls the appropriate setX function.', done => {
      const configuration = new Configuration(),
          spy = sinon.spy(configuration, 'setLevels');

      const expected = {
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

  suite('setLevels', () => {
    test('is a function.', done => {
      const configuration = new Configuration();

      assert.that(configuration.setLevels).is.ofType('function');
      done();
    });

    test('throws an error if levels are missing.', done => {
      const configuration = new Configuration();

      assert.that(() => {
        configuration.setLevels();
      }).is.throwing('Levels are missing.');
      done();
    });

    test('sets the given levels.', done => {
      const expected = {
        info: {
          color: 'green',
          enabled: true
        }
      };

      const configuration = new Configuration();

      configuration.setLevels(expected);

      assert.that(configuration.levels).is.equalTo(expected);
      done();
    });

    test('sets the given levels with respect to the LOG_LEVELS environment variable.', done => {
      nodeenv('LOG_LEVELS', 'debug', restore => {
        const input = {
          debug: {
            color: 'green',
            enabled: false
          }
        };

        const expected = {
          debug: {
            color: 'green',
            enabled: true
          }
        };

        const configuration = new Configuration();

        configuration.setLevels(input);

        assert.that(configuration.levels).is.equalTo(expected);
        restore();
        done();
      });
    });

    test('throws an error if an unknown level is provided by the LOG_LEVELS environment variable.', done => {
      nodeenv('LOG_LEVELS', 'foobar', restore => {
        assert.that(() => {
          /* eslint-disable no-new */
          new Configuration();
          /* eslint-enable no-new */
        }).is.throwing('Unknown log level foobar.');

        restore();
        done();
      });
    });

    test('sets all levels if the LOG_LEVELS environment variable contains a \'*\'.', done => {
      nodeenv('LOG_LEVELS', '*', restore => {
        const input = {
          debug: {
            color: 'green',
            enabled: false
          },
          info: {
            color: 'white',
            enabled: false
          }
        };

        const expected = {
          debug: {
            color: 'green',
            enabled: true
          },
          info: {
            color: 'white',
            enabled: true
          }
        };

        const configuration = new Configuration();

        configuration.setLevels(input);

        assert.that(configuration.levels).is.equalTo(expected);
        restore();
        done();
      });
    });
  });
});
