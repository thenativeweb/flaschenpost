'use strict';

const stream = require('stream');

const assert = require('assertthat'),
    chalk = require('chalk');

const flaschenpost = require('../lib/flaschenpost'),
    letter = require('../lib/letter'),
    Paragraph = require('../lib/letter/Paragraph');

const PassThrough = stream.PassThrough;

suite('flaschenpost', () => {
  setup(() => {
    flaschenpost.initialize();
  });

  test('is an object.', done => {
    assert.that(flaschenpost).is.ofType('object');
    done();
  });

  suite('initialize', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.initialize).is.ofType('function');
      done();
    });
  });

  suite('use', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.use).is.ofType('function');
      done();
    });

    test('throws an error when an unknown key is specified.', done => {
      assert.that(() => {
        flaschenpost.use('foo');
      }).is.throwing('Unknown key \'foo\' specified.');
      done();
    });
  });

  suite('getLogger', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.getLogger).is.ofType('function');
      done();
    });

    test('throws an error if source is not a valid path.', done => {
      assert.that(() => {
        flaschenpost.getLogger('foobar');
      }).is.throwing('Could not find package.json.');
      done();
    });

    test('throws an error if given path does not have a package.json file.', done => {
      assert.that(() => {
        flaschenpost.getLogger('/');
      }).is.throwing('Could not find package.json.');
      done();
    });

    test('returns an object.', done => {
      assert.that(flaschenpost.getLogger(__filename)).is.ofType('object');
      done();
    });

    test('has the levels as log functions.', done => {
      const logger = flaschenpost.getLogger(__filename);

      assert.that(logger.fatal).is.ofType('function');
      assert.that(logger.error).is.ofType('function');
      assert.that(logger.warn).is.ofType('function');
      assert.that(logger.info).is.ofType('function');
      assert.that(logger.debug).is.ofType('function');
      done();
    });

    suite('log function', () => {
      test('throws an error when no message is given.', done => {
        const logger = flaschenpost.getLogger(__filename);

        assert.that(() => {
          logger.info();
        }).is.throwing('Message is missing.');
        done();
      });

      test('throws an error when message is not a string.', done => {
        const logger = flaschenpost.getLogger(__filename);

        assert.that(() => {
          logger.info(42);
        }).is.throwing('Message must be a string.');
        done();
      });

      test('writes the message to a letter.', done => {
        const logger = flaschenpost.getLogger(__filename);

        letter.once('data', function (paragraph) {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.equalTo({
            foo: 'bar',
            metadata: {
              bar: 'baz'
            }
          });
          done();
        });

        logger.info(`App started.`, {
          foo: 'bar',
          metadata: {
            bar: 'baz'
          }
        });
      });

      test('writes the message to a letter even when no filename was specified.', done => {
        const logger = flaschenpost.getLogger();

        letter.once('data', function (paragraph) {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.equalTo({
            foo: 'bar',
            metadata: {
              bar: 'baz'
            }
          });
          done();
        });

        logger.info('App started.', {
          foo: 'bar',
          metadata: {
            bar: 'baz'
          }
        });
      });

      test('does not write a message if the log level is disabled.', done => {
        const logger = flaschenpost.getLogger(__filename);
        let counter = 0;

        letter.once('data', () => {
          counter++;
        });

        logger.debug('App started.');

        setTimeout(() => {
          assert.that(counter).is.equalTo(0);
          done();
        }, 0.1 * 1000);
      });
    });
  });

  suite('uncork', () => {
    test('transforms JSON into a human readable format.', done => {
      const inputStream = new PassThrough({ objectMode: true }),
          outputStream = new PassThrough({ objectMode: true });

      const paragraph = JSON.stringify(new Paragraph(0, {
        module: {
          name: 'foo',
          version: '0.0.1'
        },
        source: __filename,
        level: 'info',
        message: 'App started.',
        metadata: {
          foo: 'bar'
        }
      })) + '\n';

      flaschenpost.uncork(inputStream, outputStream);

      outputStream.once('data', data => {
        assert.that(chalk.stripColor(data).indexOf([
          'App started. (info)',
          'foo@0.0.1 ('
        ].join('\n'))).is.equalTo(0);

        assert.that(chalk.stripColor(data).indexOf([
          '{',
          '  foo: \'bar\'',
          '}',
          '\u2500'.repeat(process.stdout.columns || 80) + '\n'
        ].join('\n'))).is.greaterThan(0);

        letter.unpipe(inputStream);
        done();
      });

      inputStream.write(paragraph);
    });

    test('removes prefixes from JSON.', done => {
      const inputStream = new PassThrough({ objectMode: true }),
          outputStream = new PassThrough({ objectMode: true });

      const paragraph = 'prefix: ' + JSON.stringify(new Paragraph(0, {
        module: {
          name: 'foo',
          version: '0.0.1'
        },
        source: __filename,
        level: 'info',
        message: 'App started.',
        metadata: {
          foo: 'bar'
        }
      })) + '\n';

      flaschenpost.uncork(inputStream, outputStream);

      outputStream.once('data', data => {
        assert.that(chalk.stripColor(data).indexOf([
          'App started. (info)',
          'foo@0.0.1 ('
        ].join('\n'))).is.equalTo(0);

        assert.that(chalk.stripColor(data).indexOf([
          '{',
          '  foo: \'bar\'',
          '}',
          '\u2500'.repeat(process.stdout.columns || 80) + '\n'
        ].join('\n'))).is.greaterThan(0);

        done();
      });

      inputStream.write(paragraph);
    });

    test('handles invalid JSON.', done => {
      const inputStream = new PassThrough({ objectMode: true }),
          outputStream = new PassThrough({ objectMode: true });

      const paragraph = 'prefix: ' + JSON.stringify({
        module: {
          name: 'foo',
          version: '0.0.1'
        },
        source: __filename,
        level: 'info',
        message: 'App started.',
        metadata: {
          foo: 'bar'
        }
      }).substr(0, 16) + '\n';

      flaschenpost.uncork(inputStream, outputStream);

      outputStream.once('data', data => {
        assert.that(chalk.stripColor(data).indexOf([
          'prefix: {"module":{"name (info)',
          'n/a@n/a'
        ].join('\n'))).is.equalTo(0);

        assert.that(chalk.stripColor(data).indexOf([
          '#-1',
          '\u2500'.repeat(process.stdout.columns || 80) + '\n'
        ].join('\n'))).is.greaterThan(0);

        done();
      });

      inputStream.write(paragraph);
    });

    test('handles arbitrary strings.', done => {
      const inputStream = new PassThrough({ objectMode: true }),
          outputStream = new PassThrough({ objectMode: true });

      const paragraph = 'prefix: foobar\n';

      flaschenpost.uncork(inputStream, outputStream);

      outputStream.once('data', data => {
        assert.that(chalk.stripColor(data).indexOf([
          'prefix: foobar (info)',
          'n/a@n/a'
        ].join('\n'))).is.equalTo(0);

        assert.that(chalk.stripColor(data).indexOf([
          '#-1',
          '\u2500'.repeat(process.stdout.columns || 80) + '\n'
        ].join('\n'))).is.greaterThan(0);

        done();
      });

      inputStream.write(paragraph);
    });
  });
});
