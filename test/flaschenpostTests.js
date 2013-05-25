'use strict';

var assert = require('node-assertthat'),
    cases = require('cases');

var flaschenpost = require('../lib/flaschenpost'),
    TestTransport = require('./TestTransport');

suite('flaschenpost', function () {
  suiteSetup(function () {
    flaschenpost.setupNode({
      hostname: 'localhost',
      port: 3000,
      id: '12a30e3632a51fdab4fedd07bcc219b433e17343'
    });
  });

  test('create returns an object with log functions.', function () {
    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });

    assert.that(logger, is.ofType('object'));
    assert.that(logger.fatal, is.ofType('function'));
    assert.that(logger.error, is.ofType('function'));
    assert.that(logger.warn, is.ofType('function'));
    assert.that(logger.info, is.ofType('function'));
    assert.that(logger.debug, is.ofType('function'));
  });

  test('calls all registered transports on log.', function (done) {
    flaschenpost.add(TestTransport, function (/*level, message, metadata*/) {
      flaschenpost.remove(TestTransport);
      done();
    });

    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });
    logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo');
  });

  test('logs all required information.', function (done) {
    flaschenpost.add(TestTransport, function (level, message) {
      assert.that(level, is.equalTo('info'));
      var messageAsJson = JSON.parse(message);
      assert.that(messageAsJson.id, is.ofType('number'));
      assert.that(messageAsJson.timestamp, is.ofType('string'));
      assert.that(messageAsJson.module, is.equalTo('flaschenpost'));
      assert.that(messageAsJson.node, is.equalTo({ hostname: 'localhost', port: 3000, id: '12a30e3632a51fdab4fedd07bcc219b433e17343' }));
      assert.that(messageAsJson.uuid, is.equalTo('1fd68e8d-10d0-4f56-b30d-6b88c02d1012'));
      assert.that(messageAsJson.level, is.equalTo('info'));
      assert.that(messageAsJson.message, is.equalTo('foo'));
      assert.that(messageAsJson.metadata, is.equalTo({ bar: 'baz' }));
      flaschenpost.remove(TestTransport);
      done();
    });

    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });
    logger.info('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo', { bar: 'baz' });
  });

  test('logs with the correct level.', cases([
    [ 'fatal' ],
    [ 'error' ],
    [ 'warn' ],
    [ 'info' ],
    [ 'debug' ]
  ], function (level, done) {
    flaschenpost.add(TestTransport, function (receivedLevel) {
      assert.that(receivedLevel, is.equalTo(level));
      flaschenpost.remove(TestTransport);
      done();
    });

    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });
    logger[level]('1fd68e8d-10d0-4f56-b30d-6b88c02d1012', 'foo');
  }));

  test('throws an error if no uuid is given, but metadata are given.', function () {
    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });
    assert.that(function () {
      logger.info('foo', { bar: 'baz' });
    }, is.throwing());
  });

  test('throws an error if no uuid is given and no metadata are given.', function () {
    var logger = flaschenpost.getLogger({
      module: 'flaschenpost'
    });
    assert.that(function () {
      logger.info('foo');
    }, is.throwing());
  });
});