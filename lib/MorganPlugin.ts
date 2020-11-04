import { flaschenpost } from './flaschenpost';
import { Logger } from './Logger';
import { LogLevel } from './LogLevel';
import stackTrace from 'stack-trace';
import { Writable } from 'stream';

class MorganPlugin extends Writable {
  protected logLevel: LogLevel;

  protected logger: Logger;

  public constructor (logLevel: LogLevel, sourcePathOverride?: string) {
    const sourcePath = sourcePathOverride ?? stackTrace.get()[1].getFileName();

    super({ objectMode: true });

    this.logLevel = logLevel;
    this.logger = flaschenpost.getLogger(sourcePath);
  }

  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  public _write (chunk: any, encoding: string, callback: (err?: Error) => void): void {
    this.logger[this.logLevel](chunk);
    callback();
  }
}

export { MorganPlugin };
