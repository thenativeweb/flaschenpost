import { LogTarget } from './LogTarget';

const defaultLogTarget: LogTarget = function (logEntry: string): void {
  /* eslint-disable no-console */
  console.log(logEntry);
  /* eslint-enable no-console */
};

export {
  defaultLogTarget
};
