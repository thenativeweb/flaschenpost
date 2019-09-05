import { cloneDeep } from 'lodash';
import Configuration from './Configuration';
import formatters from './formatters';
import fs from 'fs';
import getLogEntryIdGenerator from './getLogEntryIdGenerator';
import isLogLevel from './isLogLevel';
import Logger from './Logger';
import MorganPlugin from './MorganPlugin';
import os from 'os';
import processenv from 'processenv';
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

  public getLogger (sourcePathOverride?: string): Logger {
    let sourcePath = stackTrace.get()[1].getFileName();

    if (sourcePathOverride) {
      /* eslint-disable no-sync */
      fs.accessSync(sourcePathOverride, fs.constants.R_OK);
      /* eslint-enable no-sync */

      sourcePath = sourcePathOverride;
    }

    const logger = new Logger(this.configuration, sourcePath);

    return logger;
  }
}

export default new Flaschenpost();
export { Configuration, Flaschenpost, formatters, MorganPlugin };
