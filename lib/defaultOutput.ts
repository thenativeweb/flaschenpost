import { Output } from './Output';

const defaultOutput: Output = function (logEntry: string): void {
  /* eslint-disable no-console */
  console.log(logEntry);
  /* eslint-enable no-console */
};

export {
  defaultOutput
};
