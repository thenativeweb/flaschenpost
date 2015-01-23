'use strict';

var assert = require('assertthat');

var pad = require('../../lib/cli/pad');

suite('pad', function () {
  test('is a function.', function (done) {
    assert.that(pad, is.ofType('function'));
    done();
  });

  suite('string', function () {
    test('returns a right-padded string.', function (done) {
      assert.that(pad('foo', 5), is.equalTo('foo  '));
      done();
    });

    test('returns the string if it already has the desired length.', function (done) {
      assert.that(pad('foo', 3), is.equalTo('foo'));
      done();
    });

    test('returns a shortened string if it is too long.', function (done) {
      assert.that(pad('foobar', 3), is.equalTo('fo…'));
      done();
    });
  });

  suite('number', function () {
    test('returns a left-padded string.', function (done) {
      assert.that(pad(23, 5), is.equalTo('   23'));
      done();
    });

    test('returns the stringified number if it already has the desired length.', function (done) {
      assert.that(pad(23, 2), is.equalTo('23'));
      done();
    });

    test('returns a shortened number if it is too long.', function (done) {
      assert.that(pad(256, 2), is.equalTo('2…'));
      done();
    });
  });

  suite('boolean', function () {
    test('returns a right-padded string.', function (done) {
      assert.that(pad(true, 5), is.equalTo('true '));
      done();
    });

    test('returns the stringified boolean if it already has the desired length.', function (done) {
      assert.that(pad(true, 4), is.equalTo('true'));
      done();
    });

    test('returns a shortened boolean if it is too long.', function (done) {
      assert.that(pad(true, 3), is.equalTo('tr…'));
      done();
    });
  });

  suite('undefined', function () {
    test('returns a right-padded string.', function (done) {
      assert.that(pad(undefined, 10), is.equalTo('undefined '));
      done();
    });

    test('returns the \'undefined\' if it already has the desired length.', function (done) {
      assert.that(pad(undefined, 9), is.equalTo('undefined'));
      done();
    });

    test('returns a shortened value if it is too long.', function (done) {
      assert.that(pad(undefined, 6), is.equalTo('undef…'));
      done();
    });
  });
});
