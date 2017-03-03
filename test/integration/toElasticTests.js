'use strict';

const path = require('path');

const assert = require('assertthat'),
      async = require('async'),
      elasticsearch = require('elasticsearch'),
      processenv = require('processenv'),
      shell = require('shelljs');

const env = require('../helpers/env'),
      waitFor = require('../helpers/waitFor');

suite('toElastic', function () {
  this.timeout(60 * 1000);

  let testIndex = 0;

  setup(done => {
    testIndex += 1;

    async.series({
      runElastic (callback) {
        shell.exec(`docker run -d -p 9200:9200 -p 9300:9300 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" --name elastic${testIndex} docker.elastic.co/elasticsearch/elasticsearch:5.2.2`, callback);
      },
      waitForElastic (callback) {
        waitFor(env.ELASTIC_URL, callback);
      }
    }, done);
  });

  teardown(done => {
    if (processenv('CIRCLECI')) {
      // On CircleCI, we are not allowed to remove Docker containers.
      return done(null);
    }

    shell.exec([
      `docker kill elastic${testIndex}; docker rm -v elastic${testIndex}`
    ].join(';'), done);
  });

  test('sends messages to Elasticsearch.', done => {
    shell.exec(`node writeMessages.js | ELASTIC_URL=${env.ELASTIC_URL} node ../../bin/flaschenpost-to-elastic.js`, {
      cwd: path.join(__dirname, '..', 'helpers')
    }, code => {
      assert.that(code).is.equalTo(0);

      // Delay querying Elasticsearch since by default it only flushes to disk
      // every few seconds. For details, see Elasticsearch's documentation at:
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-translog.html#_flush_settings
      setTimeout(() => {
        const client = new elasticsearch.Client({
          host: env.ELASTIC_URL
        });

        client.search({
          index: 'logs',
          type: 'message',
          body: {
            sort: [
              { id: 'asc' }
            ]
          }
        }, (err, res) => {
          assert.that(err).is.undefined();

          const messages = res.hits.hits;

          /* eslint-disable no-underscore-dangle */
          assert.that(messages[0]._source.level).is.equalTo('info');
          assert.that(messages[0]._source.message).is.equalTo('Application started.');
          assert.that(messages[1]._source.level).is.equalTo('error');
          assert.that(messages[1]._source.message).is.equalTo('Something, somewhere went horribly wrong...');
          /* eslint-enable no-underscore-dangle */

          done();
        });
      }, 5.5 * 1000);
    });
  });
});
