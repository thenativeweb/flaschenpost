import appRootPath from 'app-root-path';
import { cloneDeep } from 'lodash';
import { Formatter } from './formatters/Formatter';
import { LogEntryIdGenerator } from './LogEntryIdGenerator';
import { LogLevel } from './LogLevel';
import { PackageJson } from './PackageJson';
import { readPackageJson } from './readPackageJson';

class Configuration {
  public application: PackageJson;

  public debugModuleFilter: string[];

  public formatter: Formatter;

  public highestEnabledLogLevel: LogLevel;

  public hostname: string;

  public logEntryIdGenerator: LogEntryIdGenerator;

  public constructor (
    debugModuleFilter: string[],
    formatter: Formatter,
    highestEnabledLogLevel: LogLevel,
    hostname: string,
    logEntryIdGenerator: LogEntryIdGenerator
  ) {
    this.application = readPackageJson(appRootPath.path);
    this.debugModuleFilter = debugModuleFilter;
    this.formatter = formatter;
    this.highestEnabledLogLevel = highestEnabledLogLevel;
    this.hostname = hostname;
    this.logEntryIdGenerator = logEntryIdGenerator;
  }

  public withApplication (application: PackageJson): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.application = application;

    return newConfiguration;
  }

  public withDebugModuleFilter (debugModuleFilter: string[]): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.debugModuleFilter = debugModuleFilter;

    return newConfiguration;
  }

  public withFormatter (formatter: Formatter): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.formatter = formatter;

    return newConfiguration;
  }

  public withHighestEnabledLogLevel (highestEnabledLogLevel: LogLevel): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.highestEnabledLogLevel = highestEnabledLogLevel;

    return newConfiguration;
  }

  public withHostname (hostname: string): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.hostname = hostname;

    return newConfiguration;
  }

  public withLogEntryIdGenerator (logEntryIdGenerator: LogEntryIdGenerator): Configuration {
    const newConfiguration = cloneDeep(this);

    newConfiguration.logEntryIdGenerator = logEntryIdGenerator;

    return newConfiguration;
  }
}

export { Configuration };
