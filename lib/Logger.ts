import Configuration from './Configuration';
import LogEntry from './LogEntry';
import { LogLevel } from './LogLevel';
import { PackageJson } from './PackageJson';

class Logger {
  protected configuration: Configuration;

  protected module: PackageJson;

  protected sourcePath: string;

  public constructor (configuration: Configuration, sourcePath: string, packageJson: PackageJson) {
    this.configuration = configuration;
    this.sourcePath = sourcePath;
    this.module = packageJson;
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
    if (!this.isDebugLoggingEnabled()) {
      return;
    }

    this.log('debug', message, metadata);
  }

  protected isLogLevelEnabled (logLevel: LogLevel): boolean {
    if (this.configuration.highestEnabledLogLevel === 'debug') {
      return [ 'fatal', 'error', 'warn', 'info', 'debug' ].includes(logLevel);
    }
    if (this.configuration.highestEnabledLogLevel === 'info') {
      return [ 'fatal', 'error', 'warn', 'info' ].includes(logLevel);
    }
    if (this.configuration.highestEnabledLogLevel === 'warn') {
      return [ 'fatal', 'error', 'warn' ].includes(logLevel);
    }
    if (this.configuration.highestEnabledLogLevel === 'error') {
      return [ 'fatal', 'error' ].includes(logLevel);
    }
    if (this.configuration.highestEnabledLogLevel === 'fatal') {
      return [ 'fatal' ].includes(logLevel);
    }

    throw new Error('Invalid operation.');
  }

  protected isDebugLoggingEnabled (): boolean {
    if (this.configuration.debugModuleFilter.length === 0) {
      return true;
    }

    return this.configuration.debugModuleFilter.includes(this.module.name);
  }

  protected log (logLevel: LogLevel, message: string, metadata?: object): void {
    if (!this.isLogLevelEnabled(logLevel)) {
      return;
    }

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

export default Logger;
