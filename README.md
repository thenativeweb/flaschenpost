# flaschenpost

flaschenpost is a logger for cloud-based applications.

![flaschenpost](https://github.com/thenativeweb/flaschenpost/raw/master/images/logo.jpg "flaschenpost")

> *A [/ˈflaʃənˌpɔst/](https://en.wiktionary.org/wiki/Flaschenpost) is a &bdquo;message written on a scrap of paper, rolled-up and put in an empty bottle and set adrift on the ocean; traditionally, a method used by castaways to advertise their distress to the outside world&rdquo;.* (from [Wiktionary](https://en.wiktionary.org/wiki/message_in_a_bottle))

## Installation

```bash
$ npm install flaschenpost
```

## Quick start

First you need to integrate flaschenpost into your application.

```javascript
const flaschenpost = require('flaschenpost');
```

### Using a logger

Next, call the `getLogger` function to acquire a logger. If you don't provide a parameter flaschenpost identifies the caller automatically.

```javascript
const logger = flaschenpost.getLogger();
```

In rare cases you need to specify the caller manually, e.g. if you wrap flaschenpost in your own logging module. In these cases, provide `__filename` as parameter.

```javascript
const logger = flaschenpost.getLogger(__filename);
```

Then you can use the functions `fatal`, `error`, `warn`, `info` and `debug` to write log messages. Simply provide the message you want to log as a parameter.

```javascript
logger.info('App started.');
```

#### Handling meta data

If you want to provide additional meta data, add a second parameter.

```javascript
logger.info('App started.', { port: 3000 });
logger.info('App started.', 3000);
```

#### Defining the log target

Unlike other loggers, flaschenpost only supports logging to the console. This is because a modern cloud-based application [never concerns itself with routing or storage of its output stream](http://12factor.net/logs).

When you are running an application using a TTY, the log messages will be written in a human-readable format. As soon as you redirect the output to a file or over the network, log messages are automatically written as JSON objects that can easily be processed by other tools.

Some log processing tools, e.g. Graylog, expect the JSON to be in a slightly different format. In these cases use the environment variable `FLASCHENPOST_FORMATTER` to set the output format you want to use. The following formats are currently supported.

Name  | Description
------|-----------------------------------
gelf  | The `GELF` format used by Graylog.
human | The default human-readable format.
json  | The default json format.

*Please note that by providing `human` you can force flaschenpost to always show human-readable output, no matter whether there is a TTY or not.*

#### Customizing the human-readable format.

Use the environment variable `FLASCHENPOST_HUMAN_FORMAT` to customize the human-readable format and to adjust to your needs.

Option              | Description
--------------------|--------------------------------------------
%application        | Name of the main application
%applicationVersion | Version of the main application
%date               | Date in YYYY-MM-DD UTC
%host               | Hostname
%id                 | Log message ID
%level              | Log level (debug, info, warn, error, fatal)
%levelColored       | Log level colored
%message            | Log message
%messageColored     | Log message colored by log level
%metadata           | Metadata, stringified
%metadataShort      | Metadata, stringified, no line-breaks
%module             | Name of the module
%moduleVersion      | Version of the module
%ms                 | Milliseconds
%origin             | Hostname, application & version, module & version (if different from application), source
%pid                | Process ID
%source             | Log source file
%time               | Time in HH:mm:ss UTC

Example:
```bash
export FLASCHENPOST_HUMAN_FORMAT='%date %time %levelColored %message %metadata'
```

#### Setting a custom host

By default, flaschenpost uses the current host's host name in log messages. If you want to change the host name being used, call the `use` function.

```javascript
flaschenpost.use('host', 'example.com');
```

### Enabling and disabling log levels

By default, only the log levels `fatal`, `error`, `warn` and `info` are printed to the console. If you want to change this, set the environment variable `LOG_LEVELS` to the comma-separated list of desired log levels.

```bash
$ export LOG_LEVELS=fatal,error
```

If you want to enable all log levels at once, you can provide a `*` character as value for the `LOG_LEVELS` environment variable.

```bash
$ export LOG_LEVELS=*
```

### Restricting `debug` logging per module

If `debug` logging is enabled (`export LOG_LEVELS=*`), this can be restricted
to specific modules, by setting the `LOG_DEBUG_MODULES` environment variable.
This must hold a comma-separated list of the modules to enable.

```bash
$ export LOG_DEBUG_MODULES=module1,@scoped/module2
```

### Setting custom log levels

If you want to change the default log levels, i.e. define other log levels, change colors or define which log levels are enabled by default, call the `use` function of flaschenpost.

```javascript
flaschenpost.use('levels', {
  fatal: {
    color: 'magenta',
    enabled: true
  },
  error: {
    color: 'red',
    enabled: true
  },
  warn: {
    color: 'yellow',
    enabled: true
  },
  info: {
    color: 'green',
    enabled: true
  },
  debug: {
    color: 'white',
    enabled: false
  }
});
```

### Using the Express middleware

If you are writing an Express-based application and you use [morgan](https://github.com/expressjs/morgan) as logger, you can easily integrate flaschenpost into it.

For that, provide the `stream` property when setting up morgan and call the `Middleware` constructor function with the desired log level.

```javascript
app.use(morgan('combined', {
  stream: new flaschenpost.Middleware('info')
}));
```

Again, in rare cases it may be necessary to provide the file name of the caller on your own.

```javascript
app.use(morgan('combined', {
  stream: new flaschenpost.Middleware('info', __filename)
}));
```

## Processing logs

To process logs, first you need to install the flaschenpost CLI globally.

```bash
$ npm install -g flaschenpost
```

### Uncorking a flaschenpost

From time to time you may want to inspect log output that was written using the JSON formatter. To turn that into human readable output again, run `flaschenpost-uncork` and provide the messages using the standard input stream.

```bash
$ cat sample.log | flaschenpost-uncork
```

### Normalizing messages

However, this won't work when your log output does not only contain messages written by flaschenpost, but also arbitrary text. In this case, run `flaschenpost-normalize` and provide the messages using the standard input stream.

```bash
$ node sample.js | flaschenpost-normalize
```

### Sending messages to Elasticsearch

If you want to process your log output with Elasticsearch and Kibana, you do not need to use Logstash or Filebeat. Instead run `flaschenpost-to-elastic` and provide the address of the Elasticsearch server using the `ELASTIC_URL` environment variable.

```bash
$ node sample.js | ELASTIC_URL=localhost:9200 flaschenpost-to-elastic
```

Please note that it may be needed to normalize the messages before sending them to Elasticsearch. You probably also want to redirect the application's standard error stream to its standard output stream.

```bash
$ node sample.js 2>&1 | flaschenpost-normalize | ELASTIC_URL=localhost:9200 flaschenpost-to-elastic
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```bash
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2013-2016 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
