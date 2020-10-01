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

  protected isDebugFilterEnabled: boolean;

  public readonly isDebugMode: boolean;

  public constructor (configuration: Configuration, sourcePath: string, packageJson: PackageJson) {
    this.configuration = configuration;
    this.sourcePath = sourcePath;
    this.module = packageJson;

    this.isDebugMode = configuration.highestEnabledLogLevel === 'debug';
    this.numericLogLevel = logLevelMap[configuration.highestEnabledLogLevel];

    if (this.numericLogLevel < 5) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.debug = noop;
    }
    if (this.numericLogLevel < 4) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.info = noop;
    }
    if (this.numericLogLevel < 3) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.warn = noop;
    }
    if (this.numericLogLevel < 2) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.error = noop;
    }

    if (this.configuration.debugModuleFilter.length === 0) {
      this.isDebugFilterEnabled = true;
    } else {
      this.isDebugFilterEnabled = this.configuration.debugModuleFilter.includes(this.module.name);
    }
  }

  public fatal (message: string, metadata?: Record<string, unknown>): void {
    this.log('fatal', message, metadata);
  }

  public error (message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  public warn (message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  public info (message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  public debug (message: string, metadata?: Record<string, unknown>): void {
    if (!this.isDebugFilterEnabled) {
      return;
    }

    this.log('debug', message, metadata);
  }

  protected log (logLevel: LogLevel, message: string, metadata?: Record<string, unknown>): void {
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
