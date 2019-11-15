import { assert } from 'assertthat';
import { isLogLevel } from '../../lib/isLogLevel';

suite('isLogLevel', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(isLogLevel).is.ofType('function');
  });

  test('returns true for a valid log level.', async (): Promise<void> => {
    const inputs = [ 'fatal', 'error', 'warn', 'info', 'debug' ];

    for (const input of inputs) {
      assert.that(isLogLevel(input)).is.true();
    }
  });

  test('returns false for an invalid log level.', async (): Promise<void> => {
    assert.that(isLogLevel('non-existent')).is.false();
  });
});
