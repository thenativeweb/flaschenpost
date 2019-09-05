import cloneDeepWith from 'lodash/cloneDeepWith';
import isError from 'lodash/isError';
import serializeError from 'serialize-error';

const sanitizeMetadata = function (metadata: object): object {
  const cloner = function (value: any): any {
    if (isError(value)) {
      return serializeError(value);
    }

    return undefined;
  };

  return cloneDeepWith(metadata, cloner);
};

export default sanitizeMetadata;
