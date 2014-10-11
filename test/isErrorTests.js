'use strict';

var assert = require('node-assertthat');

var isError = require('../lib/isError');

suite('isError', function () {
  test('returns false for normal objects.', function (done) {
    assert.that(isError({ }), is.false());
    done();
  });

  test('returns false for normal objects with name and message property.', function (done) {
    assert.that(isError({
      name: 'foo',
      message: 'bar'
    }), is.false());
    done();
  });

  test('returns true for error objects.', function (done) {
    assert.that(isError(new Error()), is.false());
    done();
  });
});
