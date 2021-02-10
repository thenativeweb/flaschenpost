import { asHumanReadable } from 'lib/formatters/asHumanReadable';
import { assert } from 'assertthat';
import { Configuration } from '../../lib/Configuration';
import { getLogEntryIdGenerator } from 'lib/getLogEntryIdGenerator';
import { nodeenv } from 'nodeenv';
import { record } from 'record-stdstreams';
import stripAnsi from 'strip-ansi';
import { flaschenpost, Flaschenpost } from '../../lib/flaschenpost';

suite('flaschenpost', (): void => {
  test('has configure and getLogger functions.', async (): Promise<void> => {
    /* eslint-disable @typescript-eslint/unbound-method */
    assert.that(flaschenpost.configure).is.ofType('function');
    assert.that(flaschenpost.getLogger).is.ofType('function');
    /* eslint-enable @typescript-eslint/unbound-method */
  });

  suite('getConfiguration', (): void => {
    test('returns a clone of the current configuration.', async (): Promise<void> => {
      const configuration = flaschenpost.getConfiguration();

      // Assert all deterministic properties.
      assert.that(configuration.application.name).is.equalTo('flaschenpost');
      assert.that(configuration.formatter).is.ofType('function');
    });
  });

  suite('configure', (): void => {
    test('overwrites the configuration.', async (): Promise<void> => {
      const originalConfiguration = flaschenpost.getConfiguration();
      const newHostname = 'new host name';
      const newLogLevel = 'error';

      flaschenpost.configure(originalConfiguration.withHostname(newHostname).withHighestEnabledLogLevel(newLogLevel));

      const newConfiguration = flaschenpost.getConfiguration();

      assert.that(newConfiguration).is.not.equalTo(originalConfiguration);
      assert.that(newConfiguration.hostname).is.equalTo(newHostname);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(newLogLevel);

      flaschenpost.configure(originalConfiguration);
    });

    test('sets isDebugMode on creation.', async (): Promise<void> => {
      const originalConfiguration = flaschenpost.getConfiguration();
      const newLogLevel = 'debug';

      flaschenpost.configure(originalConfiguration.withHighestEnabledLogLevel(newLogLevel));

      const logger = flaschenpost.getLogger();

      assert.that(logger.isDebugMode).is.true();

      flaschenpost.configure(originalConfiguration);
    });

    suite('using environment variables', (): void => {
      let flaschenpostInstance: Flaschenpost;
      let restore: () => void;

      setup(async (): Promise<void> => {
        restore = nodeenv({
          /* eslint-disable @typescript-eslint/naming-convention */
          LOG_DEBUG_MODULE_FILTER: '',
          LOG_FORMATTER: 'json',
          LOG_LEVEL: 'debug'
          /* eslint-enable @typescript-eslint/naming-convention */
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

  test('debug filtering by module.', async (): Promise<void> => {
    const originalConfiguration = flaschenpost.getConfiguration();
    const stop = record(false);

    flaschenpost.configure(
      originalConfiguration.
        withApplication({
          name: 'some-module',
          version: 'irrelevant'
        }).
        withDebugModuleFilter([ 'not-some-module' ]).
        withHighestEnabledLogLevel('debug')
    );

    const logger = flaschenpost.getLogger();

    logger.debug('Some debug.');

    const { stdout } = stop();

    assert.that(stdout).is.equalTo('');

    flaschenpost.configure(originalConfiguration);
  });

  test('debug filtering by module using logger source override.', async (): Promise<void> => {
    const originalConfiguration = flaschenpost.getConfiguration();
    const stop = record(false);

    flaschenpost.configure(
      originalConfiguration.
        withDebugModuleFilter([ 'not-some-module' ]).
        withHighestEnabledLogLevel('debug')
    );
    const logger = flaschenpost.getLogger(undefined, { name: 'some-module', version: 'irrelevant' });

    logger.debug('Some debug.');

    const { stdout } = stop();

    assert.that(stdout).is.equalTo('');

    flaschenpost.configure(originalConfiguration);
  });

  suite('configured to log human readable and defaults', (): void => {
    let flaschenpostInstance: Flaschenpost;
    let restore: () => void;

    setup(async (): Promise<void> => {
      restore = nodeenv({
        /* eslint-disable @typescript-eslint/naming-convention */
        LOG_DEBUG_MODULE_FILTER: '',
        LOG_FORMATTER: 'human',
        LOG_LEVEL: 'info'
        /* eslint-enable @typescript-eslint/naming-convention */
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
        /* eslint-disable @typescript-eslint/naming-convention */
        LOG_DEBUG_MODULE_FILTER: '',
        LOG_FORMATTER: 'json',
        LOG_LEVEL: 'debug'
        /* eslint-enable @typescript-eslint/naming-convention */
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
});
