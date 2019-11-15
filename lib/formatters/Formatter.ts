import { LogEntry } from '../LogEntry';

export type Formatter = (logEntry: LogEntry) => string;
