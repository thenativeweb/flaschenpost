import chalk from 'chalk';
import { Formatter } from './Formatter';
import { lightFormat } from 'date-fns';
import { LogEntry } from '../LogEntry';
import stringifyObject from 'stringify-object';

const asHumanReadable: Formatter = function (logEntry: LogEntry): string {
  const dateTime = new Date(logEntry.timestamp);

  let origin = '',
      result = '';

  origin = `${logEntry.hostname}`;

  origin += `::${logEntry.application.name}@${logEntry.application.version}`;

  if (logEntry.application.name !== logEntry.module.name) {
    origin += `::${logEntry.module.name}@${logEntry.module.version}`;
  }

  if (logEntry.source) {
    origin += ` (${logEntry.source})`;
  }

  const colorize = {
    fatal: chalk.magenta,
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.green,
    debug: chalk.white
  };

  result += colorize[logEntry.level].bold(`${logEntry.message} (${logEntry.level})`);
  result += '\n';
  result += chalk.white(origin);
  result += '\n';
  result += chalk.gray(`${lightFormat(dateTime, 'HH:mm:ss.SSS')}@${lightFormat(dateTime, 'yyyy-MM-dd')} ${logEntry.processId}#${logEntry.id}`);
  result += '\n';
  if (logEntry.metadata) {
    result += chalk.gray(stringifyObject(logEntry.metadata, {
      indent: '  ',
      singleQuotes: true
    }).replace(/\\n/gu, '\n'));
    result += '\n';
  }
  result += chalk.gray('\u2500'.repeat(process.stdout.columns || 80));

  return result;
};

export { asHumanReadable };
