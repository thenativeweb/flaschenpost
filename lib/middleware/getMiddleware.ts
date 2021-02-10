import { flaschenpost } from '../flaschenpost';
import { LogLevel } from '../LogLevel';
import { LogOn } from './LogOn';
import onFinished from 'on-finished';
import { OutgoingMessage } from 'http';
import { RequestData } from './RequestData';
import { RequestHandler } from 'express';
import { ResponseData } from './ResponseData';
import stackTrace from 'stack-trace';

const getMiddleware = function ({ logOn = 'response', logLevel = 'info' }: {
  logOn?: LogOn;
  logLevel?: LogLevel;
} = {}): RequestHandler {
  const sourcePath = stackTrace.get()[1].getFileName();

  const logger = flaschenpost.getLogger(sourcePath);

  return function (req, res, next): void {
    const requestData: RequestData = {
      method: req.method,
      path: req.url,
      httpVersion: req.httpVersion,
      remoteAddress: req.socket.remoteAddress,
      referrer: req.headers.referer,
      userAgent: req.headers['user-agent']
    };

    if (logOn === 'request') {
      logger[logLevel](`Receiving '${requestData.method} ${requestData.path}'...`, {
        request: requestData
      });

      return next();
    }

    const requestStart = Date.now();

    onFinished<OutgoingMessage>(res, (): void => {
      const responseEnd = Date.now();
      const contentLengthHeader = res.getHeader('content-length');

      let contentLength;

      switch (typeof contentLengthHeader) {
        case 'number':
          contentLength = contentLengthHeader;
          break;
        case 'string':
          contentLength = contentLengthHeader ? Number(contentLengthHeader) : undefined;
          break;
        case 'object':
          contentLength = contentLengthHeader[0] ? Number(contentLengthHeader[0]) : undefined;
          break;
        case 'undefined':
          break;
        default:
          throw new Error('Invalid operation.');
      }

      const responseData: ResponseData = {
        statusCode: res.statusCode,
        time: responseEnd - requestStart,
        contentLength
      };

      logger[logLevel](`Responded '${requestData.method} ${requestData.path}'.`, {
        request: requestData,
        response: responseData
      });
    });

    next();
  };
};

export { getMiddleware };
