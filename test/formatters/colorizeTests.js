'use strict';

var assert = require('node-assertthat');

var colorize = require('../../lib/formatters/colorize');

suite('colorize', function () {
  test('is a function.', function (done) {
    assert.that(colorize, is.ofType('function'));
    done();
  });

  test('colorizes text with a color.', function (done) {
    assert.that(colorize('foo', 'red'), is.equalTo('\u001b[31mfoo\u001b[39m'));
    done();
  });

  test('colorizes text with a log level.', function (done) {
    assert.that(colorize('foo', 'info'), is.equalTo('\u001b[32mfoo\u001b[39m'));
    done();
  });

  test('colorizes text with styling.', function (done) {
    assert.that(colorize('foo', 'info', 'bold'), is.equalTo('\u001b[1m\u001b[32mfoo\u001b[39m\u001b[22m'));
    done();
  });
});
