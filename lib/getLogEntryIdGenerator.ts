import { LogEntryIdGenerator } from './LogEntryIdGenerator';
let nextId = 0;

const getLogEntryIdGenerator = function * (): LogEntryIdGenerator {
  while (true) {
    yield nextId;

    nextId += 1;
  }
};

export default getLogEntryIdGenerator;
