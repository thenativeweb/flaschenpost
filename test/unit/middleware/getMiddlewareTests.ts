import { assert } from 'assertthat';
import express from 'express';
import { getMiddleware } from '../../../lib/middleware/getMiddleware';
import { record } from 'record-stdstreams';
import request, { SuperTest, Test } from 'supertest';

suite('getMiddleware', (): void => {
  const content = 'Hello world!';

  let client: SuperTest<Test>;

  setup(async (): Promise<void> => {
    const app = express();

    app.get('/hello', getMiddleware(), (req, res): void => {
      res.send(content);
    });

    app.get('/hello-pre', getMiddleware({ logOn: 'request' }), (req, res): void => {
      res.send(content);
    });

    app.get('/hello-post', getMiddleware({ logOn: 'response' }), (req, res): void => {
      res.send(content);
    });

    app.get('/hello-warn', getMiddleware({ logOn: 'request', logLevel: 'warn' }), (req, res): void => {
      res.send(content);
    });

    client = request(app);
  });

  test('logs when a request is received.', async (): Promise<void> => {
    const stop = record(false);

    await client.get('/hello-pre');

    const { stdout } = stop();
    const { source, message, level, metadata } = JSON.parse(stdout.trim());

    assert.that(source).is.equalTo(__filename);
    assert.that(message).is.equalTo(`Receiving 'GET /hello-pre'...`);
    assert.that(level).is.equalTo('info');
    assert.that(metadata).is.atLeast({
      request: {
        method: 'GET',
        path: '/hello-pre',
        httpVersion: '1.1'
      }
    });
  });

  test('logs when a response was sent.', async (): Promise<void> => {
    const stop = record(false);

    await client.get('/hello-post');

    const { stdout } = stop();
    const { source, message, level, metadata } = JSON.parse(stdout.trim());

    assert.that(source).is.equalTo(__filename);
    assert.that(message).is.equalTo(`Responded 'GET /hello-post'.`);
    assert.that(level).is.equalTo('info');
    assert.that(metadata).is.atLeast({
      request: {
        method: 'GET',
        path: '/hello-post',
        httpVersion: '1.1'
      },
      response: {
        statusCode: 200,
        contentLength: content.length
      }
    });
    assert.that(metadata.response.time).is.atLeast(0);
  });

  test('logs on response by default.', async (): Promise<void> => {
    const stop = record(false);

    await client.get('/hello');

    const { stdout } = stop();
    const { metadata } = JSON.parse(stdout.trim());

    assert.that(metadata.response).is.not.undefined();
  });

  test('supports setting the log level manually.', async (): Promise<void> => {
    const stop = record(false);

    await client.get('/hello-warn');

    const { stdout } = stop();
    const { level } = JSON.parse(stdout.trim());

    assert.that(level).is.equalTo('warn');
  });
});
