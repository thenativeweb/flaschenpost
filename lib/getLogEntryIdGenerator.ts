import { LogEntryIdGenerator } from './LogEntryIdGenerator';

let nextId = 0;

const getLogEntryIdGenerator = function * (): LogEntryIdGenerator {
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  while (true) {
    yield nextId;

    nextId += 1;
  }
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */
};

export { getLogEntryIdGenerator };
