import { assert } from 'assertthat';
import { sanitizeMetadata } from '../../lib/sanitizeMetadata';

suite('sanitizeMetadata', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(sanitizeMetadata).is.ofType('function');
  });

  test('does nothing to normal objects.', async (): Promise<void> => {
    const metadata = { foo: 'bar' };
    const sanitizedMetadata = sanitizeMetadata(metadata);

    assert.that(sanitizedMetadata).is.equalTo(metadata);
  });

  test('returns a clone of the given metadata.', async (): Promise<void> => {
    const metadata = { foo: 'bar' };
    const sanitizedMetadata = sanitizeMetadata(metadata);

    assert.that(sanitizedMetadata).is.not.sameAs(metadata);
  });

  test('correctly serializes errors.', async (): Promise<void> => {
    const metadata = { foo: 'bar', bar: new Error('baz') };
    const sanitizedMetadata = sanitizeMetadata(metadata);

    assert.that(sanitizedMetadata).is.atLeast({
      foo: 'bar',
      bar: { name: 'Error', message: 'baz' }
    });
  });

  test('supports nested objects.', async (): Promise<void> => {
    const metadata = { foo: 'bar', bar: { bas: 'baz' }};
    const sanitizedMetadata = sanitizeMetadata(metadata);

    assert.that(sanitizedMetadata).is.atLeast({
      foo: 'bar',
      bar: { bas: 'baz' }
    });
  });
});
