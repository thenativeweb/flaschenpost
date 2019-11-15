import { LogLevel } from './LogLevel';

const isLogLevel = function (name: any): name is LogLevel {
  if (typeof name !== 'string') {
    return false;
  }

  return [ 'fatal', 'error', 'warn', 'info', 'debug' ].includes(name);
};

export { isLogLevel };
