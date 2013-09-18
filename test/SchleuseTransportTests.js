'use strict';

var assert = require('node-assertthat'),
    nock = require('nock');

var flaschenpost = require('../lib/flaschenpost');

suite('SchleuseTransport', function () {
  suiteSetup(function () {
    flaschenpost.add(flaschenpost.transports.schleuse, { host: 'localhost', port: 1200 });
  });

  suiteTeardown(function () {
    flaschenpost.remove(flaschenpost.transports.schleuse);
  });

  suite('log', function () {
    test('sends a log message to the specified schleuse.', function () {
      var localhost1200Log = nock('http://localhost:1200').filteringRequestBody(function (body) {
        body = JSON.parse(body);
        assert.that(body.id, is.ofType('string'));
        assert.that(body.timestamp, is.ofType('string'));
        assert.that(body.module, is.equalTo('flaschenpost/test/SchleuseTransport@0.0.1'));
        assert.that(body.uuid, is.equalTo('a28decb3-c833-481d-bffb-30e6acab2ef0'));
        assert.that(body.level, is.equalTo('fatal'));
        assert.that(body.message, is.equalTo('foobar'));
        return '*';
      }).post('/log', '*').reply(200, {});

      var logger = flaschenpost.getLogger({
        module: 'flaschenpost/test/SchleuseTransport',
        version: '0.0.1'
      });
      logger.fatal('a28decb3-c833-481d-bffb-30e6acab2ef0', 'foobar');
      assert.that(localhost1200Log.isDone(), is.true());
    });

    test('doesn\'t complain about a non-reachable schleuse.', function () {
      var logger = flaschenpost.getLogger({
        module: 'flaschenpost/test/SchleuseTransport',
        version: '0.0.1'
      });
      logger.fatal('a28decb3-c833-481d-bffb-30e6acab2ef0', 'foobar');
    });
  });
});