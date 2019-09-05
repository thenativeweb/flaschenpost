import assert from 'assertthat';
import getLogEntryIdGenerator from '../../lib/getLogEntryIdGenerator';

suite('getLogEntryIdGenerator', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(getLogEntryIdGenerator).is.ofType('function');
  });

  test('returns increasing numbers.', async (): Promise<void> => {
    const logEntryIdGenerator = getLogEntryIdGenerator() as Generator<number, never>;

    const { value: valueFirst } = logEntryIdGenerator.next();
    const { value: valueSecond } = logEntryIdGenerator.next();
    const { value: valueThird } = logEntryIdGenerator.next();

    assert.that(valueFirst + 1).is.equalTo(valueSecond);
    assert.that(valueSecond + 1).is.equalTo(valueThird);
  });
});
