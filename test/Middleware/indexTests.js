'use strict';

var stream = require('stream');

var assert = require('node-assertthat');

var flaschenpost = require('../../lib/flaschenpost'),
    letter = require('../../lib/letter'),
    Middleware = require('../../lib/Middleware');

var Writable = stream.Writable;

suite('Middleware', function () {
  setup(function () {
    flaschenpost.initialize();

    flaschenpost.use('module', {
      name: 'foo',
      version: '0.0.1'
    });
  });

  test('is a function.', function (done) {
    assert.that(Middleware, is.ofType('function'));
    done();
  });

  test('throws an error if level is missing.', function (done) {
    assert.that(function () {
      /*eslint-disable no-new*/
      new Middleware();
      /*eslint-enable no-new*/
    }, is.throwing('Level is missing.'));
    done();
  });

  test('throws an error if the specified level does not exist.', function (done) {
    assert.that(function () {
      /*eslint-disable no-new*/
      new Middleware('foo');
      /*eslint-enable no-new*/
    }, is.throwing('Level is invalid.'));
    done();
  });

  test('returns a writable stream.', function (done) {
    assert.that(new Middleware('info'), is.instanceOf(Writable));
    done();
  });

  test('writes messages using the specified log level.', function (done) {
    var middleware = new Middleware('info');

    letter.once('data', function (data) {
      assert.that(data.level, is.equalTo('info'));
      assert.that(data.message, is.equalTo('foobar'));
      assert.that(data.module, is.equalTo({
        name: 'foo',
        version: '0.0.1'
      }));
      done();
    });

    middleware.write('foobar');
  });

  test('uses \'express\' as default file name.', function (done) {
    var middleware = new Middleware('info');

    letter.once('data', function (data) {
      assert.that(data.file, is.equalTo('express'));
      done();
    });

    middleware.write('foobar');
  });

  test('uses the given file name if one is specified.', function (done) {
    var middleware = new Middleware('info', { file: 'express /baz' });

    letter.once('data', function (data) {
      assert.that(data.file, is.equalTo('express /baz'));
      done();
    });

    middleware.write('foobar');
  });
});
