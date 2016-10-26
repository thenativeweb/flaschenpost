'use strict';

const stream = require('stream');

const assert = require('assertthat'),
      chalk = require('chalk'),
      nodeenv = require('nodeenv');

const HumanReadable = require('../../../lib/formatters/HumanReadable');

const Transform = stream.Transform;

suite.only('HumanReadable', () => {
  let humanReadable;
  const paragraph = {
    host: 'example.com',
    pid: 82517,
    id: 0,
    timestamp: 1415024939974,
    level: 'info',
    message: 'App started.',
    application: {
      name: 'app',
      version: '1.2.3'
    },
    module: {
      name: 'foo',
      version: '0.0.1'
    },
    source: 'app.js',
    metadata: {
      foo: 'bar'
    }
  };

  suiteSetup(() => {
    chalk.enabled = true;
    humanReadable = new HumanReadable();
  });

  suite('default', () => {
    test('is a transform stream.', done => {
      assert.that(humanReadable).is.instanceOf(Transform);
      done();
    });

    test('transforms a paragraph to a human-readable string.', done => {
      humanReadable.once('data', data => {
        assert.that(chalk.stripColor(data)).is.equalTo([
          /* eslint-disable nodeca/indent */
          'App started. (info)',
          'example.com::app@1.2.3::foo@0.0.1 (app.js)',
          '14:28:59.974@2014-11-03 82517#0',
          '{',
          '  foo: \'bar\'',
          '}',
          '\u2500'.repeat(process.stdout.columns || 80),
          ''
          /* eslint-enable nodeca/indent */
        ].join('\n'));
        done();
      });

      humanReadable.write(paragraph);
    });

    test('does not throw an error if application information is missing.', done => {
      const paragraphNoApp = {
        host: 'example.com',
        pid: 82517,
        id: 0,
        timestamp: 1415024939974,
        level: 'info',
        message: 'App started.',
        module: {
          name: 'foo',
          version: '0.0.1'
        },
        source: 'app.js',
        metadata: {
          foo: 'bar'
        }
      };

      humanReadable.once('data', data => {
        assert.that(chalk.stripColor(data)).is.equalTo([
          /* eslint-disable nodeca/indent */
          'App started. (info)',
          'example.com::foo@0.0.1 (app.js)',
          '14:28:59.974@2014-11-03 82517#0',
          '{',
          '  foo: \'bar\'',
          '}',
          '\u2500'.repeat(process.stdout.columns || 80),
          ''
          /* eslint-enable nodeca/indent */
        ].join('\n'));
        done();
      });

      humanReadable.write(paragraphNoApp);
    });

    test('does not print information twice if application and module are the same.', done => {
      const paragraphSame = {
        host: 'example.com',
        pid: 82517,
        id: 0,
        timestamp: 1415024939974,
        level: 'info',
        message: 'App started.',
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'app',
          version: '1.2.3'
        },
        source: 'app.js',
        metadata: {
          foo: 'bar'
        }
      };

      humanReadable.once('data', data => {
        assert.that(chalk.stripColor(data)).is.equalTo([
          /* eslint-disable nodeca/indent */
          'App started. (info)',
          'example.com::app@1.2.3 (app.js)',
          '14:28:59.974@2014-11-03 82517#0',
          '{',
          '  foo: \'bar\'',
          '}',
          '\u2500'.repeat(process.stdout.columns || 80),
          ''
          /* eslint-enable nodeca/indent */
        ].join('\n'));
        done();
      });

      humanReadable.write(paragraphSame);
    });
  });

  suite('custom', () => {
    test('%application', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%application'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('app\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%applicationVersion', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%applicationVersion'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('1.2.3\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%date', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%date'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('2014-11-03\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%host', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%host'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('example.com\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%id', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%id'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('0\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%level', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%level'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('info\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%levelColored', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%levelColored'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.not.equalTo('info\n');
          assert.that(chalk.stripColor(data)).is.equalTo('info\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%message', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%message'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('App started.\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%messageColored', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%messageColored'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.not.equalTo('App started.\n');
          assert.that(chalk.stripColor(data)).is.equalTo('App started.\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%metadata', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%metadata'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo([
            '{',
            '  foo: \'bar\'',
            '}',
            ''
          ].join('\n'));
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%metadataShort', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%metadataShort'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('{foo: \'bar\'}\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%module', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%module'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('foo\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%moduleVersion', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%moduleVersion'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('0.0.1\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%ms', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%ms'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('974\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%origin', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%origin'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('example.com::app@1.2.3::foo@0.0.1 (app.js)\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%pid', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%pid'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('82517\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%source', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%source'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('app.js\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('%time', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '%time'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('14:28:59\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });

    test('combined string', done => {
      nodeenv({
        FLASCHENPOST_HUMAN_FORMAT: '[%date %time.%ms] (%application@%applicationVersion/%module@%moduleVersion) %level: %message (%source) %metadataShort'
      }, restore => {
        humanReadable.once('data', data => {
          assert.that(data).is.equalTo('[2014-11-03 14:28:59.974] (app@1.2.3/foo@0.0.1) info: App started. (app.js) {foo: \'bar\'}\n');
          restore();
          done();
        });

        humanReadable.write(paragraph);
      });
    });
  });
});
