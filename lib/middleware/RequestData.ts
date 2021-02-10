interface RequestData {
  method: string;
  path: string;
  httpVersion: string;
  remoteAddress: string | undefined;
  referrer: string | undefined;
  userAgent: string | undefined;
}

export { RequestData };
