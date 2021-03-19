import { asHumanReadable } from '../../../lib/formatters/asHumanReadable';
import { assert } from 'assertthat';
import { LogEntry } from '../../../lib/LogEntry';
import stripAnsi from 'strip-ansi';

suite('asHumanReadable', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(asHumanReadable).is.ofType('function');
  });

  test('stringifies the given log entry.', async (): Promise<void> => {
    const logEntry = new LogEntry(
      0,
      'localhost',
      12_345,
      { name: 'test-app', version: '1.0.0' },
      { name: 'test-module', version: '1.0.0' },
      '/foo/bar.js',
      1_567_581_970_578,
      'info',
      'Server started.',
      false
    );

    const formattedLogEntry = asHumanReadable(logEntry);
    const lines = stripAnsi(formattedLogEntry).split('\n');

    assert.that(lines[0]).is.equalTo('Server started. (info)');
    assert.that(lines[1]).is.equalTo('localhost::test-app@1.0.0::test-module@1.0.0 (/foo/bar.js)');

    // Cannot reliably test line 2 because of utc.
    assert.that(lines[3]).is.equalTo('────────────────────────────────────────────────────────────────────────────────');
  });
});
