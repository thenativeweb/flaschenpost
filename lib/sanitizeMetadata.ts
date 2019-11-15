import { serializeError } from 'serialize-error';
import { cloneDeepWith, isError } from 'lodash';

const sanitizeMetadata = function (metadata: object): object {
  const cloner = function (value: any): any {
    if (isError(value)) {
      return serializeError(value);
    }

    return undefined;
  };

  return cloneDeepWith(metadata, cloner);
};

export { sanitizeMetadata };
