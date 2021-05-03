# flaschenpost

flaschenpost is a logger for cloud-based applications.

![flaschenpost](https://github.com/thenativeweb/flaschenpost/raw/main/images/logo.jpg "flaschenpost")

> _A [/ˈflaʃənˌpɔst/](https://en.wiktionary.org/wiki/Flaschenpost) is a „message written on a scrap of paper, rolled-up and put in an empty bottle and set adrift on the ocean; traditionally, a method used by castaways to advertise their distress to the outside world”._ (from [Wiktionary](https://en.wiktionary.org/wiki/message_in_a_bottle))

## Status

| Category         | Status                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/flaschenpost)](https://www.npmjs.com/package/flaschenpost)           |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/flaschenpost)                                          |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/flaschenpost)                                      |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/flaschenpost/workflows/Release/badge.svg?branch=main) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/flaschenpost)                                |

## Installation

```shell
$ npm install flaschenpost
```

## Quick start

First you need to add a reference to flaschenpost to your application:

```javascript
const { flaschenpost } = require('flaschenpost');
```

If you use TypeScript, use the following code instead:

```typescript
import { flaschenpost } from 'flaschenpost';
```

Then, call the `getLogger` function to get a logger for the current file. Ideally, this is only done once per file:

```javascript
const logger = flaschenpost.getLogger();
```

With this logger you can now log messages, using its `fatal`, `error`, `info`, `warn` and `debug` functions. E.g., to log an info message, call the `info` function with an appropriate log message:

```javascript
logger.info('Server started.');
```

From time to time you may want to also provide additional metadata for the log message. For this, hand over a metadata object as second parameter:

```javascript
logger.info('Server started.', { port: 3000 });
```

_Please note that the metadata parameter must be an object. If you want to use other data types as metadata, such as booleans, numbers or strings, you need to wrap them within an object._

If at any point in your application code you want to check wether debug logging is enabled (to e.g. measure times for more detailled logging), you can do so via the public readonly property `isDebugMode` on the logger instance:

```javascript
if (logger.isDebugMode) {
  // Collect more data and log it.
}
```

### Managing log levels

By default flaschenpost only logs `fatal`, `error`, `warn` and `info` messages, but not `debug` messages. To change this, set the `LOG_LEVEL` environment variable to the log level that you would like to log message up to. E.g., to enable logging for all log levels, set its value to `debug`:

```shell
$ export LOG_LEVEL=debug
```

If you only want to see log messages with levels `fatal` and `error`, set it to `error`. The same concept applies to all other log levels.

Setting the log level to `debug` may result in a huge amount of log messages, which may not be what you want. Hence you can limit which modules you would like to see debug output for by setting the `LOG_DEBUG_MODULE_FILTER` environment variable to the name or a comma-separated list of the names of the appropriate modules.

E.g., to only get debug log messages for modules `foo` and `bar`, use the following line:

```shell
$ export LOG_DEBUG_MODULE_FILTER=foo,bar
```

### Formatting log messages

The core concept of flaschenpost is to always log to the standard output stream of a process, according to the [12 Factor Apps](https://12factor.net/logs) principles. However, it makes a difference if you use flaschenpost in an interactive shell session, or in a scripted environment.

If flaschenpost detects a TTY, you will get the log messages as human-readable output. If it doesn't detect a TTY, you will get them formatted as newline-separated JSON.

Sometimes it is necessary to override this default behavior, e.g. in tests. For this, set the `LOG_FORMATTER` environment variable to `human` or to `json`, to enforce one of the two styles:

```shell
$ LOG_FORMATTER=human
```

### Faking log sources

Basically, when calling the `getLogger` function, flaschenpost automatically detects the file from which this call is done, and infers the appropriate file name. Sometimes, this is not desired, as you may want to manually set the file name used as source.

Therefore, you can provide a file path as a parameter to the `getLogger` function. Please note that this file path must be an absolute path, and that it must point to an existing file:

```javascript
const logger = flaschenpost.getLogger('/.../app.js');
```

To provide a virtual file path that does not exist, pass an additional parameter defining the module the file belongs to:

```javascript
const logger = flaschenpost.getLogger(
  '/virtual/path/.../app.js',
  {
    name: 'custom-package',
    version: '1.0.1'
  }
);
```

### Using the flaschenpost middleware

flaschenpost can be used as a middleware for Express. For this, first load flaschenpost's `getMiddleware` function:

```javascript
const { getMiddleware } = require('flaschenpost');
```

If you use TypeScript, use the following code instead:

```typescript
import { getMiddleware } from 'flaschenpost';
```

Create an instance of the middleware by calling `getMiddleware` and register it via the usual way in your Express application:

```javascript
app.use(getMiddleware());
```

Sometimes you may want to log when the request is received, not when the response was sent, e.g. for long-running connections. For these cases, provide the `logOn` option and set it to `request`:

```javascript
app.use(getMiddleware({ logOn: 'request' }));
```

By default, the middleware uses `info` as log level. To change this, provide the `logLevel` option and set it to the desired value:

```javascript
app.use(getMiddleware({ logLevel: 'warn' }));
```

### Configuring flaschenpost programmatically

Sometimes, you may need to change the configuration of flaschenpost programmatically. To do this, first get the current configuration using the `getConfiguration` function:

```javascript
const configuration = flaschenpost.getConfiguration();
```

The configuration object now has a number of functions (see section below) to adjust the configuration. E.g., if you want to change the hostname being used, call the `withHostname` function:

```javascript
const updatedConfiguration = configuration.withHostname('localhost');
```

_Please note that all of the functions on the configuration object do not mutate the configuration, but return a new instance instead!_

Finally, set the new configuration using the `configure` function. Typically, because of the configuration object's immutability, you may want to do all of this in a single line:

```javascript
flaschenpost.configure(
  flaschenpost.getConfiguration().
    withHighestEnabledLogLevel('debug').
    withHostname('localhost')
);
```

#### Setting application data

To set the name and version of the application, use the `withApplication` function:

```javascript
const updatedConfiguration =
  configuration.withApplication({ name: 'foo', version: '1.0.0' });
```

#### Setting the debug module filter

To set the list of modules for which debug messages should be logged, use the `withDebugModuleFilter` function:

```javascript
const updatedConfiguration =
  configuration.withDebugModuleFilter([ 'foo', 'bar' ]);
```

#### Setting the formatter

To set the formatter, use the `withFormatter` function. As parameter, provide a function that takes a `LogEntry` and returns a string:

```javascript
const updatedConfiguration =
  configuration.withFormatter(logEntry => '...');
```

For details on this see the [`Formatter`](https://github.com/thenativeweb/flaschenpost/blob/master/lib/formatters/Formatter.ts) interface and the [`LogEntry`](https://github.com/thenativeweb/flaschenpost/blob/master/lib/LogEntry.ts) class.

If you want to programmatically enforce human-readable or JSON output, you first have to load all builtin formatters:

```javascript
const { formatters } = require('flaschenpost');
```

If you use TypeScript, use the following code instead:

```typescript
import { formatters } from 'flaschenpost';
```

Then access the `asHumanReadable` or the `asJson` function and hand it over using the `withFormatter` function.

#### Setting the log level

To set the log level, use the `withHighestEnabledLogLevel` function:

```javascript
const updatedConfiguration =
  configuration.withHighestEnabledLogLevel('debug');
```

#### Setting the hostname

To set the hostname, use the `withHostname` function:

```javascript
const updatedConfiguration =
  configuration.withHostname('localhost');
```

#### Setting the log entry ID generator

To set the log entry ID generator, use the `withLogEntryIdGenerator` function. As parameter, provide a generator function that endlessly returns new IDs, either of type `number` or of type `string`:

```javascript
const updatedConfiguration =
  configuration.withLogEntryIdGenerator(function * () {
    while (true) {
      const nextId = // ...

      yield nextId;
    }
  });
```

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
