import { serializeError } from 'serialize-error';
import { cloneDeepWith, isError } from 'lodash';

const cloner = function (value: any): any {
  if (!isError(value)) {
    return;
  }

  return serializeError(value);
};

const sanitizeMetadata = function (metadata: Record<string, unknown>): Record<string, unknown> {
  return cloneDeepWith(metadata, cloner);
};

export { sanitizeMetadata };
