'use strict';

var stream = require('stream');

var assert = require('node-assertthat');

var letter = require('../../lib/letter');

var Transform = stream.Transform;

suite('letter', function () {
  test('is a transform stream.', function (done) {
    assert.that(letter, is.instanceOf(Transform));
    done();
  });

  suite('write', function () {
    test('returns a paragraph.', function (done) {
      var expected = {
        level: 'info',
        message: 'App started.',
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', function (paragraph) {
        assert.that(paragraph, is.ofType('object'));
        assert.that(paragraph.id, is.ofType('number'));
        assert.that(paragraph.timestamp, is.not.undefined());
        assert.that(paragraph.level, is.equalTo(expected.level));
        assert.that(paragraph.message, is.equalTo(expected.message));
        assert.that(paragraph.module, is.equalTo(expected.module));
        assert.that(paragraph.source, is.undefined());
        assert.that(paragraph.metadata, is.undefined());
        done();
      });

      letter.write(expected);
    });

    test('increments the paragraph id by 1.', function (done) {
      var input = {
        level: 'info',
        message: 'App started.',
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', function (paragraph) {
        var firstId = paragraph.id;

        letter.once('data', function (paragraph) {
          var secondId = paragraph.id;

          assert.that(firstId, is.lessThan(secondId));
          assert.that(firstId + 1, is.equalTo(secondId));
          done();
        });
      });

      letter.write(input);
      letter.write(input);
    });
  });
});
