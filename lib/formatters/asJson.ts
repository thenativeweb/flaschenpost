import { Formatter } from './Formatter';
import { LogEntry } from '../LogEntry';

const asJson: Formatter = function (logEntry: LogEntry): string {
  return JSON.stringify(logEntry);
};

export { asJson };
