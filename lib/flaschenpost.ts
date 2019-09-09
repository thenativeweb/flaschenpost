import { cloneDeep } from 'lodash';
import Configuration from './Configuration';
import findRoot from 'find-root';
import formatters from './formatters';
import fs from 'fs';
import getLogEntryIdGenerator from './getLogEntryIdGenerator';
import isLogLevel from './isLogLevel';
import Logger from './Logger';
import MorganPlugin from './MorganPlugin';
import os from 'os';
import { PackageJson } from './PackageJson';
import processenv from 'processenv';
import readPackageJson from './readPackageJson';
import stackTrace from 'stack-trace';

class Flaschenpost {
  protected configuration: Configuration;

  public constructor () {
    const stringifiedDebugModuleFilter = processenv('LOG_DEBUG_MODULE_FILTER', '');

    if (typeof stringifiedDebugModuleFilter !== 'string') {
      throw new Error('Debug module filter invalid.');
    }

    const debugModuleFilter = stringifiedDebugModuleFilter.
      split(',').
      filter((item: string): boolean => Boolean(item));

    let formatter = process.stdout.isTTY ?
      formatters.asHumanReadable :
      formatters.asJson;

    const formatterOverride = processenv('LOG_FORMATTER');

    if (formatterOverride) {
      formatter = formatterOverride === 'human' ?
        formatters.asHumanReadable :
        formatters.asJson;
    }

    const logLevel = processenv('LOG_LEVEL', 'info');

    if (!isLogLevel(logLevel)) {
      throw new Error(`Log level '${logLevel}' unknown.`);
    }

    const highestEnabledLogLevel = logLevel;

    const hostname = os.hostname();

    const logEntryIdGenerator = getLogEntryIdGenerator();

    this.configuration = new Configuration(
      debugModuleFilter,
      formatter,
      highestEnabledLogLevel,
      hostname,
      logEntryIdGenerator
    );
  }

  public configure (configuration: Configuration): void {
    this.configuration = configuration;
  }

  public getConfiguration (): Configuration {
    return cloneDeep(this.configuration);
  }

  // Creates a logger for a given source.
  //
  // Checks the existence of the file at sourcePathOverride only if no
  // packageJsonOverride is given, otherwise accepts both.
  public getLogger (sourcePathOverride?: string, packageJsonOverride?: PackageJson): Logger {
    let sourcePath = stackTrace.get()[1].getFileName();
    let packageJson;

    if (sourcePathOverride) {
      if (!packageJsonOverride) {
        /* eslint-disable no-sync */
        fs.accessSync(sourcePathOverride, fs.constants.R_OK);
        /* eslint-enable no-sync */
      }
      sourcePath = sourcePathOverride;
    }

    if (packageJsonOverride) {
      packageJson = packageJsonOverride;
    } else {
      const modulePath = findRoot(sourcePath);

      packageJson = readPackageJson(modulePath);
    }

    return new Logger(this.configuration, sourcePath, packageJson);
  }
}

export default new Flaschenpost();
export { Configuration, Flaschenpost, formatters, MorganPlugin };
