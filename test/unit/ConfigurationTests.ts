import { asJson } from 'lib/formatters/asJson';
import { assert } from 'assertthat';
import { Configuration } from '../../lib/Configuration';
import { Formatter } from '../../lib/formatters/Formatter';
import { getLogEntryIdGenerator } from 'lib/getLogEntryIdGenerator';
import { LogLevel } from '../../lib/LogLevel';

suite('Configuration', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(Configuration).is.ofType('function');
  });

  const defaultConfiguration = new Configuration(
    [ '' ],
    asJson,
    'info',
    'localhost',
    getLogEntryIdGenerator()
  );

  suite('withApplication', (): void => {
    test('returns a clone of the configuration with a new application.', async (): Promise<void> => {
      const newApplication = {
        name: 'new-application',
        version: '13.3.7'
      };
      const newConfiguration = defaultConfiguration.withApplication(newApplication);

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.sameAs(newApplication);
      assert.that(newConfiguration.debugModuleFilter).is.equalTo(defaultConfiguration.debugModuleFilter);
      assert.that(newConfiguration.formatter).is.equalTo(defaultConfiguration.formatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(defaultConfiguration.highestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.equalTo(defaultConfiguration.hostname);
      assert.that(newConfiguration.logEntryIdGenerator).is.equalTo(defaultConfiguration.logEntryIdGenerator);
    });
  });

  suite('withDebugModuleFilter', (): void => {
    test('returns a clone of the configuration with a new debug module filter.', async (): Promise<void> => {
      const newDebugModuleFilter: string[] = [];
      const newConfiguration = defaultConfiguration.withDebugModuleFilter(newDebugModuleFilter);

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.equalTo(defaultConfiguration.application);
      assert.that(newConfiguration.debugModuleFilter).is.sameAs(newDebugModuleFilter);
      assert.that(newConfiguration.formatter).is.equalTo(defaultConfiguration.formatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(defaultConfiguration.highestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.equalTo(defaultConfiguration.hostname);
      assert.that(newConfiguration.logEntryIdGenerator).is.equalTo(defaultConfiguration.logEntryIdGenerator);
    });
  });

  suite('withFormatter', (): void => {
    test('returns a clone of the configuration with a new formatter.', async (): Promise<void> => {
      /* eslint-disable unicorn/consistent-function-scoping */
      const newFormatter: Formatter = (): string => 'log entry';
      /* eslint-enable unicorn/consistent-function-scoping */

      const newConfiguration = defaultConfiguration.withFormatter(newFormatter);

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.equalTo(defaultConfiguration.application);
      assert.that(newConfiguration.debugModuleFilter).is.equalTo(defaultConfiguration.debugModuleFilter);
      assert.that(newConfiguration.formatter).is.sameAs(newFormatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(defaultConfiguration.highestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.equalTo(defaultConfiguration.hostname);
      assert.that(newConfiguration.logEntryIdGenerator).is.equalTo(defaultConfiguration.logEntryIdGenerator);
    });
  });

  suite('withHighestEnabledLogLevel', (): void => {
    test('returns a clone of the configuration with a new highest enabled log level.', async (): Promise<void> => {
      const newHighestEnabledLogLevel: LogLevel = 'error';
      const newConfiguration = defaultConfiguration.withHighestEnabledLogLevel(newHighestEnabledLogLevel);

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.equalTo(defaultConfiguration.application);
      assert.that(newConfiguration.debugModuleFilter).is.equalTo(defaultConfiguration.debugModuleFilter);
      assert.that(newConfiguration.formatter).is.equalTo(defaultConfiguration.formatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.sameAs(newHighestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.equalTo(defaultConfiguration.hostname);
      assert.that(newConfiguration.logEntryIdGenerator).is.equalTo(defaultConfiguration.logEntryIdGenerator);
    });
  });

  suite('withHostname', (): void => {
    test('returns a clone of the configuration with a new hostname.', async (): Promise<void> => {
      const newHostname = 'new host name';
      const newConfiguration = defaultConfiguration.withHostname(newHostname);

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.equalTo(defaultConfiguration.application);
      assert.that(newConfiguration.debugModuleFilter).is.equalTo(defaultConfiguration.debugModuleFilter);
      assert.that(newConfiguration.formatter).is.equalTo(defaultConfiguration.formatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(defaultConfiguration.highestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.sameAs(newHostname);
      assert.that(newConfiguration.logEntryIdGenerator).is.equalTo(defaultConfiguration.logEntryIdGenerator);
    });
  });

  suite('withLogEntryIdGenerator', (): void => {
    test('returns a clone of the configuration with a new log entry id generator.', async (): Promise<void> => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const newLogEntryIdGenerator = function * (): Generator<number, never> {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
          yield 1_337;
        }
      };
      const newConfiguration = defaultConfiguration.withLogEntryIdGenerator(newLogEntryIdGenerator());

      assert.that(newConfiguration).is.not.sameAs(defaultConfiguration);
      assert.that(newConfiguration.application).is.equalTo(defaultConfiguration.application);
      assert.that(newConfiguration.debugModuleFilter).is.equalTo(defaultConfiguration.debugModuleFilter);
      assert.that(newConfiguration.formatter).is.equalTo(defaultConfiguration.formatter);
      assert.that(newConfiguration.highestEnabledLogLevel).is.equalTo(defaultConfiguration.highestEnabledLogLevel);
      assert.that(newConfiguration.hostname).is.equalTo(defaultConfiguration.hostname);
      assert.that(newConfiguration.logEntryIdGenerator.next().value).is.equalTo(1_337);
    });
  });
});
