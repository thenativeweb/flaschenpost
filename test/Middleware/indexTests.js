'use strict';

var stream = require('stream');

var assert = require('node-assertthat'),
    express = require('express'),
    morgan = require('morgan'),
    request = require('supertest');

var flaschenpost = require('../../lib/flaschenpost'),
    letter = require('../../lib/letter'),
    Middleware = require('../../lib/Middleware');

var Writable = stream.Writable;

suite('Middleware', function () {
  setup(function () {
    flaschenpost.initialize();
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
      new Middleware('foo', __filename);
      /*eslint-enable no-new*/
    }, is.throwing('Level is invalid.'));
    done();
  });

  test('returns a writable stream.', function (done) {
    assert.that(new Middleware('info', __filename), is.instanceOf(Writable));
    done();
  });

  test('writes messages using the specified log level.', function (done) {
    var middleware = new Middleware('info', __filename);

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

  test('writes messages using the specified log level even if no filename was specified.', function (done) {
    var app = express(),
        counter = 0;

    app.use(morgan('combined', {
      stream: new Middleware('info')
    }));

    app.get('/', function (req, res) {
      res.send('foobar');
    });

    letter.once('data', function (data) {
      assert.that(data.module, is.equalTo({
        name: 'foo',
        version: '0.0.1'
      }));
      counter++;
    });

    request(app).get('/').end(function (err) {
      assert.that(err, is.equalTo(null));
      assert.that(counter, is.equalTo(1));
      done();
    });
  });
});
