'use strict';

var assert = require('node-assertthat');

var isError = require('../lib/isError');

suite('isError', function () {
  test('returns false for normal objects.', function () {
    assert.that(isError({}), is.false());
  });

  test('returns false for normal objects with name and message property.', function () {
    assert.that(isError({
      name: 'foo',
      message: 'bar'
    }), is.false());
  });

  test('returns true for error objects.', function () {
    assert.that(isError(new Error()), is.false());
  });
});
