import asHumanReadable from 'lib/formatters/asHumanReadable';
import assert from 'assertthat';
import Configuration from '../../lib/Configuration';
import { Flaschenpost } from '../../lib/flaschenpost';
import getLogEntryIdGenerator from 'lib/getLogEntryIdGenerator';
import { nodeenv } from 'nodeenv';
import record from 'record-stdstreams';
import stripAnsi from 'strip-ansi';

suite('flaschenpost', (): void => {
  suite('configured to log human readable and defaults', (): void => {
    let flaschenpostInstance: Flaschenpost;
    let restore: () => void;

    setup(async (): Promise<void> => {
      restore = nodeenv({
        LOG_DEBUG_MODULE_FILTER: '',
        LOG_FORMATTER: 'human',
        LOG_LEVEL: 'info'
      });

      flaschenpostInstance = new Flaschenpost();
    });

    teardown(async (): Promise<void> => {
      restore();
    });

    test('logs in a human readable format up to info level.', async (): Promise<void> => {
      const stop = record(false);
      const logger = flaschenpostInstance.getLogger();

      logger.info('Info message');
      logger.debug('Debug message');

      const { stdout } = stop();
      const lines = stripAnsi(stdout).split('\n');

      assert.that(lines).is.containing('Info message (info)');
      assert.that(lines).is.not.containing('Debug message (debug)');
    });
  });

  suite('configured to log json readable up to debug', (): void => {
    let flaschenpostInstance: Flaschenpost;
    let restore: () => void;

    setup(async (): Promise<void> => {
      restore = nodeenv({
        LOG_DEBUG_MODULE_FILTER: '',
        LOG_FORMATTER: 'json',
        LOG_LEVEL: 'debug'
      });

      flaschenpostInstance = new Flaschenpost();
    });

    teardown(async (): Promise<void> => {
      restore();
    });

    test('logs in json format up to debug level.', async (): Promise<void> => {
      const stop = record(false);
      const logger = flaschenpostInstance.getLogger();

      logger.info('Info message');
      logger.debug('Debug message');

      const { stdout } = stop();
      const lines = stdout.split('\n');
      const jsonLineOne = JSON.parse(lines[0]);
      const jsonLineTwo = JSON.parse(lines[1]);

      assert.that(jsonLineOne.id).is.equalTo(0);
      assert.that(jsonLineOne.level).is.equalTo('info');
      assert.that(jsonLineOne.message).is.equalTo('Info message');

      assert.that(jsonLineTwo.id).is.equalTo(1);
      assert.that(jsonLineTwo.level).is.equalTo('debug');
      assert.that(jsonLineTwo.message).is.equalTo('Debug message');
    });
  });

  suite('configure', (): void => {
    let flaschenpostInstance: Flaschenpost;
    let restore: () => void;

    setup(async (): Promise<void> => {
      restore = nodeenv({
        LOG_DEBUG_MODULE_FILTER: '',
        LOG_FORMATTER: 'json',
        LOG_LEVEL: 'debug'
      });

      flaschenpostInstance = new Flaschenpost();
    });

    teardown(async (): Promise<void> => {
      restore();
    });

    test('overwrites configuration.', async (): Promise<void> => {
      const stop = record(false);

      flaschenpostInstance.configure(new Configuration(
        [ '' ],
        asHumanReadable,
        'error',
        'localhost',
        getLogEntryIdGenerator()
      ));
      const logger = flaschenpostInstance.getLogger();

      logger.error('Error message');
      logger.info('Info message');

      const { stdout } = stop();
      const lines = stripAnsi(stdout).split('\n');

      assert.that(lines).is.containing('Error message (error)');
      assert.that(lines.length).is.equalTo(5);
    });
  });
});
