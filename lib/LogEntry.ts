import { LogLevel } from './LogLevel';
import { PackageJson } from './PackageJson';
import { sanitizeMetadata } from './sanitizeMetadata';

class LogEntry {
  public id: number | string;

  public hostname: string;

  public processId: number;

  public application: PackageJson;

  public module: PackageJson;

  public source: string;

  public timestamp: number;

  public level: LogLevel;

  public message: string;

  public metadata?: Record<string, unknown>;

  public constructor (
    id: number | string,
    hostname: string,
    processId: number,
    application: PackageJson,
    module: PackageJson,
    source: string,
    timestamp: number,
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ) {
    this.id = id;
    this.hostname = hostname;
    this.processId = processId;
    this.application = application;
    this.module = module;
    this.source = source;
    this.timestamp = timestamp;
    this.level = level;
    this.message = message;

    if (metadata) {
      this.metadata = sanitizeMetadata(metadata);
    }
  }
}

export { LogEntry };
