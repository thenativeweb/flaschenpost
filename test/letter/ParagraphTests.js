'use strict';

const assert = require('assertthat');

const Paragraph = require('../../lib/letter/Paragraph');

suite('Paragraph', function () {
  test('is a function.', function (done) {
    assert.that(Paragraph).is.ofType('function');
    done();
  });

  test('throws an error if id is missing.', function (done) {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph();
      /* eslint-enable no-new */
    }).is.throwing('Id is missing.');
    done();
  });

  test('throws an error if data is missing.', function (done) {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0);
      /* eslint-enable no-new */
    }).is.throwing('Data is missing.');
    done();
  });

  test('throws an error if level is missing.', function (done) {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, {});
      /* eslint-enable no-new */
    }).is.throwing('Level is missing.');
    done();
  });

  test('throws an error if message is missing.', function (done) {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, { level: 'error' });
      /* eslint-enable no-new */
    }).is.throwing('Message is missing.');
    done();
  });

  test('throws an error if metadata is given and metadata is not an object.', function (done) {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, { level: 'error', message: 'foo', metadata: 'bar' });
      /* eslint-enable no-new */
    }).is.throwing('Invalid metadata.');
    done();
  });

  test('returns a paragraph.', function (done) {
    const id = 23;
    const data = {
      level: 'error',
      message: 'foo'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.pid).is.equalTo(process.pid);
    assert.that(paragraph.id).is.equalTo(id);
    assert.that(paragraph.timestamp).is.ofType('number');
    assert.that(paragraph.level).is.equalTo(data.level);
    assert.that(paragraph.message).is.equalTo(data.message);
    done();
  });

  test('returns a paragraph with a module if a module is given.', function (done) {
    const id = 23;
    const data = {
      level: 'error',
      message: 'foo',
      module: 'bar'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.module).is.equalTo(data.module);
    done();
  });

  test('returns a paragraph with a source if a source is given.', function (done) {
    const id = 23;
    const data = {
      level: 'error',
      message: 'foo',
      source: 'bar'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.source).is.equalTo(data.source);
    done();
  });

  test('returns a paragraph with metadata if metadata are given.', function (done) {
    const id = 23;
    const data = {
      level: 'error',
      message: 'foo',
      metadata: {
        foo: 'bar'
      }
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.metadata).is.equalTo(data.metadata);
    done();
  });
});
