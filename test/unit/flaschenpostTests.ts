import { assert } from 'assertthat';
import { flaschenpost } from '../../lib/flaschenpost';
import { record } from 'record-stdstreams';

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
});
