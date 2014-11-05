'use strict';

var stream = require('stream');

var assert = require('node-assertthat');

var Json = require('../../lib/formatters/Json');

var Transform = stream.Transform;

suite('Json', function () {
  var json;

  suiteSetup(function () {
    json = new Json();
  });

  test('is a transform stream.', function (done) {
    assert.that(json, is.instanceOf(Transform));
    done();
  });

  test('transforms a paragraph to a serialized JSON string.', function (done) {
    var paragraph = {
      id: 0,
      timestamp: 1415024939974,
      level: 'info',
      message: 'App started.',
      module: {
        name: 'foo',
        version: '0.0.1'
      },
      file: 'app.js',
      data: {
        foo: 'bar'
      }
    };

    json.once('data', function (data) {
      assert.that(data, is.equalTo([
        /*eslint-disable nodeca/indent*/
        '{',
          '"id":0,',
          '"timestamp":1415024939974,',
          '"level":"info",',
          '"message":"App started.",',
          '"module":{',
            '"name":"foo",',
            '"version":"0.0.1"',
          '},',
          '"file":"app.js",',
          '"data":{',
            '"foo":"bar"',
          '}',
        '}\n'
        /*eslint-enable nodeca/indent*/
      ].join('')));
      done();
    });

    json.write(paragraph);
  });
});
