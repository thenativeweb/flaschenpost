'use strict';

var assert = require('node-assertthat'),
    cases = require('cases');

var flaschenpost = require('../lib/flaschenpost');

suite('flaschenpost', function () {
  suite('getLogger', function () {
    test('throws an error when no module is given.', function () {
      assert.that(function () {
        flaschenpost.getLogger({
          version: '0.0.1'
        });
      }, is.throwing());
    });

    test('throws an error when no version is given.', function () {
      assert.that(function () {
        flaschenpost.getLogger({
          module: 'flaschenpost'
        });
      }, is.throwing());
    });
  });

  test('returns an object with logging functions.', function () {
    var logger = flaschenpost.getLogger({
      module: 'flaschenpost',
      version: '0.0.1'
    });

    assert.that(logger, is.ofType('object'));
    assert.that(logger.fatal, is.ofType('function'));
    assert.that(logger.error, is.ofType('function'));
    assert.that(logger.warn, is.ofType('function'));
    assert.that(logger.info, is.ofType('function'));
    assert.that(logger.debug, is.ofType('function'));
  });

  test('pipes to the registered writable streams.', function (done) {
    flaschenpost.once('data', function () {
      done();
    });

    var logger = flaschenpost.getLogger({
      module: 'flaschenpost',
      version: '0.0.1'
    });
    logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo');
  });

  suite('when not running on a node', function () {
    test('does not put the node object into a log message.', function (done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.level, is.equalTo('info'));
        assert.that(message.node, is.undefined());
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });

      logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo', { bar: 'baz' });
    });
  });

  suite('when running on a node', function () {
    suiteSetup(function () {
      flaschenpost.setupNode({
        host: 'localhost',
        port: 3000,
        id: '12a30e3632a51fdab4fedd07bcc219b433e17343'
      });
    });

    test('logs all required information.', function (done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.level, is.equalTo('info'));
        assert.that(message.id, is.ofType('string'));
        assert.that(message.id.length, is.equalTo(40));
        assert.that(message.timestamp, is.ofType('number'));
        assert.that(message.module, is.equalTo('flaschenpost@0.0.1'));
        assert.that(message.node, is.equalTo({ host: 'localhost', port: 3000, id: '12a30e3632a51fdab4fedd07bcc219b433e17343' }));
        assert.that(message.uuid, is.equalTo('1fd68e8d-10d0-4f56-b30d-6b88c02d1012'));
        assert.that(message.level, is.equalTo('info'));
        assert.that(message.message, is.equalTo('foo'));
        assert.that(message.metadata, is.equalTo({ bar: 'baz' }));
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo', { bar: 'baz' });
    });

    test('omits metadata when no metadata are given.', function (done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.level, is.equalTo('info'));
        assert.that(message.id, is.ofType('string'));
        assert.that(message.id.length, is.equalTo(40));
        assert.that(message.timestamp, is.ofType('number'));
        assert.that(message.module, is.equalTo('flaschenpost@0.0.1'));
        assert.that(message.node, is.equalTo({ host: 'localhost', port: 3000, id: '12a30e3632a51fdab4fedd07bcc219b433e17343' }));
        assert.that(message.uuid, is.equalTo('1fd68e8d-10d0-4f56-b30d-6b88c02d1012'));
        assert.that(message.level, is.equalTo('info'));
        assert.that(message.message, is.equalTo('foo'));
        assert.that(message.metadata, is.undefined());
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo');
    });

    test('logs errors correctly.', function (done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.metadata.name, is.equalTo('Error'));
        assert.that(message.metadata.message, is.equalTo('foo'));
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo', new Error('foo'));
    });

    test('logs errors correctly when they appear recursively.', function (done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.metadata, is.ofType('object'));
        assert.that(message.metadata.error, is.ofType('object'));
        assert.that(message.metadata.error.name, is.equalTo('Error'));
        assert.that(message.metadata.error.message, is.equalTo('foo'));
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo', { error: new Error('foo') });
    });

    test('logs with the correct level.', cases([
      [ 'fatal' ],
      [ 'error' ],
      [ 'warn' ],
      [ 'info' ],
      [ 'debug' ]
    ], function (level, done) {
      flaschenpost.once('data', function (message) {
        assert.that(message.level, is.equalTo(level));
        done();
      });

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      logger[level]('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo');
    }));

    test('throws an error if no uuid is given, but metadata are given.', function () {
      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      assert.that(function () {
        logger.info('foo', { bar: 'baz' });
      }, is.throwing('UUID is missing.'));
    });

    test('throws an error if no uuid is given and no metadata are given.', function () {
      var logger = flaschenpost.getLogger({
        module: 'flaschenpost',
        version: '0.0.1'
      });
      assert.that(function () {
        logger.info('foo');
      }, is.throwing('UUID is missing.'));
    });
  });

  suite('middleware', function () {
    test('returns a logging stream compatible to Express.', function () {
      var middleware = flaschenpost.middleware({
        module: 'foo',
        version: '0.0.1',
        uuid: '11ed349a-fa70-42d4-946c-7da473bc3566'
      });
      assert.that(middleware, is.ofType('object'));
      assert.that(middleware.stream, is.ofType('object'));
      assert.that(middleware.stream.write, is.ofType('function'));
    });
  });
});
