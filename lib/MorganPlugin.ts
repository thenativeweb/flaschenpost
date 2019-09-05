import flaschenpost from './flaschenpost';
import Logger from './Logger';
import { LogLevel } from './LogLevel';
import stackTrace from 'stack-trace';
import { Writable } from 'stream';

class MorganPlugin extends Writable {
  protected logLevel: LogLevel;

  protected logger: Logger;

  public constructor (logLevel: LogLevel, sourcePathOverride?: string) {
    let sourcePath = stackTrace.get()[1].getFileName();

    if (sourcePathOverride) {
      sourcePath = sourcePathOverride;
    }

    super({ objectMode: true });

    this.logLevel = logLevel;
    this.logger = flaschenpost.getLogger(sourcePath);
  }

  /* eslint-disable no-underscore-dangle, @typescript-eslint/member-naming */
  public _write (chunk: any, encoding: string, callback: (err?: Error) => void): void {
    this.logger[this.logLevel](chunk);
    callback();
  }
  /* eslint-enable no-underscore-dangle, @typescript-eslint/member-naming */
}

export default MorganPlugin;
