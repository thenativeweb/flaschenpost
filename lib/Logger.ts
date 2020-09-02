import { Configuration } from './Configuration';
import { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';
import { PackageJson } from './PackageJson';

const noop = function (): void {
  // Intentionally left blank.
};

const logLevelMap = {
  debug: 5,
  info: 4,
  warn: 3,
  error: 2,
  fatal: 1
};

class Logger {
  protected configuration: Configuration;

  protected module: PackageJson;

  protected sourcePath: string;

  protected numericLogLevel: number;

  public constructor (configuration: Configuration, sourcePath: string, packageJson: PackageJson) {
    this.configuration = configuration;
    this.sourcePath = sourcePath;
    this.module = packageJson;

    this.numericLogLevel = logLevelMap[configuration.highestEnabledLogLevel];

    if (this.numericLogLevel < 5) {
      this.debug = noop;
    }
    if (this.numericLogLevel < 4) {
      this.info = noop;
    }
    if (this.numericLogLevel < 3) {
      this.warn = noop;
    }
    if (this.numericLogLevel < 2) {
      this.error = noop;
    }
  }

  public fatal (message: string, metadata?: object): void {
    this.log('fatal', message, metadata);
  }

  public error (message: string, metadata?: object): void {
    this.log('error', message, metadata);
  }

  public warn (message: string, metadata?: object): void {
    this.log('warn', message, metadata);
  }

  public info (message: string, metadata?: object): void {
    this.log('info', message, metadata);
  }

  public debug (message: string, metadata?: object): void {
    if (!this.isDebugFilterEnabled()) {
      return;
    }

    this.log('debug', message, metadata);
  }

  protected isDebugFilterEnabled (): boolean {
    if (this.configuration.debugModuleFilter.length === 0) {
      return true;
    }

    return this.configuration.debugModuleFilter.includes(this.module.name);
  }

  protected log (logLevel: LogLevel, message: string, metadata?: object): void {
    const logEntry = new LogEntry(
      this.configuration.logEntryIdGenerator.next().value,
      this.configuration.hostname,
      process.pid,
      this.configuration.application,
      this.module,
      this.sourcePath,
      Date.now(),
      logLevel,
      message,
      metadata
    );

    const formattedLogEntry = this.configuration.formatter(logEntry);

    /* eslint-disable no-console */
    console.log(formattedLogEntry);
    /* eslint-enable no-console */
  }
}

export { Logger };
