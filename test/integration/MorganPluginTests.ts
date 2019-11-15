import { asHumanReadable } from '../../lib/formatters/asHumanReadable';
import { assert } from 'assertthat';
import { Configuration } from '../../lib/Configuration';
import { flaschenpost } from '../../lib/flaschenpost';
import { MorganPlugin } from '../../lib/MorganPlugin';
import { record } from 'record-stdstreams';
import stripAnsi from 'strip-ansi';

suite('MorganPlugin', (): void => {
  suite('with flaschenpost configured to log human readable and defaults', (): void => {
    let originalConfiguration: Configuration;

    setup(async (): Promise<void> => {
      originalConfiguration = flaschenpost.getConfiguration();
      flaschenpost.configure(originalConfiguration.withFormatter(asHumanReadable));
    });

    teardown(async (): Promise<void> => {
      flaschenpost.configure(originalConfiguration);
    });

    test('passes writes to stream on to a flaschenpost.', async (): Promise<void> => {
      const stop = record(false);
      const morganPlugin = new MorganPlugin('info');

      morganPlugin.write('some log message');

      const { stdout } = stop();
      const lines = stripAnsi(stdout).split('\n');

      assert.that(lines[0]).is.equalTo('some log message (info)');
    });
  });
});
