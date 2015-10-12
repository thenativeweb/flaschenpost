'use strict';

const assert = require('assertthat');

const sanitize = require('../../lib/letter/sanitizeMetadata');

suite('sanitizeMetadata', () => {
  test('does nothing to normal objects.', done => {
    const actual = sanitize({
      foo: 'bar'
    });

    assert.that(actual).is.equalTo({
      foo: 'bar'
    });
    done();
  });

  test('preserves arrays.', done => {
    const actual = sanitize({
      foo: [ 'bar' ]
    });

    assert.that(actual).is.equalTo({
      foo: [ 'bar' ]
    });
    done();
  });

  test('converts error objects to normal ones.', done => {
    const actual = sanitize(new Error('foo'));

    assert.that(actual).is.ofType('object');
    assert.that(actual.name).is.equalTo('Error');
    assert.that(actual.message).is.equalTo('foo');
    assert.that(actual.stack).is.ofType('string');
    done();
  });

  test('converts recursive objects.', done => {
    const actual = sanitize({
      error: new Error('foo'),
      data: 'bar'
    });

    assert.that(actual).is.ofType('object');
    assert.that(actual.error).is.ofType('object');
    assert.that(actual.error.name).is.equalTo('Error');
    assert.that(actual.error.message).is.equalTo('foo');
    assert.that(actual.error.stack).is.ofType('string');
    assert.that(actual.data).is.equalTo('bar');
    done();
  });

  test('returns a copy of the object.', done => {
    const data = {
      foo: 'bar'
    };

    assert.that(sanitize(data)).is.not.sameAs(data);
    done();
  });
});
