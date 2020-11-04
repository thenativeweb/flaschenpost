import { asJson } from '../../../lib/formatters/asJson';
import { assert } from 'assertthat';
import { LogEntry } from '../../../lib/LogEntry';
import { oneLineTrim } from 'common-tags';

suite('asJson', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(asJson).is.ofType('function');
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
      'Server started.'
    );

    const formattedLogEntry = asJson(logEntry);

    assert.that(formattedLogEntry).is.equalTo(oneLineTrim`
      {
        "id":0,
        "hostname":"localhost",
        "processId":12345,
        "application":{"name":"test-app","version":"1.0.0"},
        "module":{"name":"test-module","version":"1.0.0"},
        "source":"/foo/bar.js",
        "timestamp":1567581970578,
        "level":"info",
        "message":"Server started."
      }
    `);
  });
});
