'use strict';

var assert = require('node-assertthat');

var flaschenpost = require('../lib/flaschenpost'),
    letter = require('../lib/letter');

suite('flaschenpost', function () {
  setup(function () {
    flaschenpost.initialize();
  });

  test('is an object.', function (done) {
    assert.that(flaschenpost, is.ofType('object'));
    done();
  });

  suite('initialize', function () {
    test('is a function.', function (done) {
      assert.that(flaschenpost.initialize, is.ofType('function'));
      done();
    });
  });

  suite('use', function () {
    test('is a function.', function (done) {
      assert.that(flaschenpost.use, is.ofType('function'));
      done();
    });

    test('throws an error when an unknown key is specified.', function (done) {
      assert.that(function () {
        flaschenpost.use('foo');
      }, is.throwing('Unknown key \'foo\' specified.'));
      done();
    });
  });

  suite('getLogger', function () {
    test('is a function.', function (done) {
      assert.that(flaschenpost.getLogger, is.ofType('function'));
      done();
    });

    test('throws an error if source is missing.', function (done) {
      assert.that(function () {
        flaschenpost.getLogger();
      }, is.throwing('Source is missing.'));
      done();
    });

    test('throws an error if source is not a valid path.', function (done) {
      assert.that(function () {
        flaschenpost.getLogger('foobar');
      }, is.throwing('Could not find package.json.'));
      done();
    });

    test('throws an error if given path does not have a package.json file.', function (done) {
      assert.that(function () {
        flaschenpost.getLogger('/');
      }, is.throwing('Could not find package.json.'));
      done();
    });

    test('returns an object.', function (done) {
      assert.that(flaschenpost.getLogger(__filename), is.ofType('object'));
      done();
    });

    test('has the levels as log functions.', function (done) {
      var logger = flaschenpost.getLogger(__filename);
      assert.that(logger.fatal, is.ofType('function'));
      assert.that(logger.error, is.ofType('function'));
      assert.that(logger.warn, is.ofType('function'));
      assert.that(logger.info, is.ofType('function'));
      assert.that(logger.debug, is.ofType('function'));
      done();
    });

    suite('log function', function () {
      test('throws an error when no message is given.', function (done) {
        var logger = flaschenpost.getLogger(__filename);
        assert.that(function () {
          logger.info();
        }, is.throwing('Message is missing.'));
        done();
      });

      test('throws an error when message is not a string.', function (done) {
        var logger = flaschenpost.getLogger(__filename);
        assert.that(function () {
          logger.info(42);
        }, is.throwing('Message must be a string.'));
        done();
      });

      test('writes the message to a letter.', function (done) {
        var logger = flaschenpost.getLogger(__filename);

        letter.once('data', function (paragraph) {
          assert.that(paragraph, is.ofType('object'));
          assert.that(paragraph.pid, is.equalTo(process.pid));
          assert.that(paragraph.id, is.ofType('number'));
          assert.that(paragraph.timestamp, is.not.undefined());
          assert.that(paragraph.level, is.equalTo('info'));
          assert.that(paragraph.message, is.equalTo('App bar started.'));
          assert.that(paragraph.module, is.equalTo({
            name: 'foo',
            version: '0.0.1'
          }));
          assert.that(paragraph.source, is.equalTo(__filename));
          assert.that(paragraph.metadata, is.equalTo({
            foo: 'bar',
            metadata: {
              bar: 'baz'
            }
          }));
          done();
        });

        logger.info('App {{foo}} started.', {
          foo: 'bar',
          metadata: {
            bar: 'baz'
          }
        });
      });

      test('does not write a message if the log level is disabled.', function (done) {
        var logger = flaschenpost.getLogger(__filename);

        var counter = 0;
        letter.once('data', function () {
          counter++;
        });

        logger.debug('App started.');

        setTimeout(function () {
          assert.that(counter, is.equalTo(0));
          done();
        }, 0.1 * 1000);
      });
    });
  });

  suite('uncork', function () {
    test('...');
  });
});
