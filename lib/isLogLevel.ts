import { LogLevel } from './LogLevel';

const isLogLevel = function (name: string): name is LogLevel {
  return [ 'fatal', 'error', 'warn', 'info', 'debug' ].includes(name);
};

export default isLogLevel;
