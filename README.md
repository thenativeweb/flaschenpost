# flaschenpost

flaschenpost is a logger for cloud and cli applications.

> *A [/ˈflaʃənˌpɔst/](https://en.wiktionary.org/wiki/Flaschenpost) is a &bdquo;message written on a scrap of paper, rolled-up and put in an empty bottle and set adrift on the ocean; traditionally, a method used by castaways to advertise their distress to the outside world&rdquo;.* (from [Wiktionary](https://en.wiktionary.org/wiki/message_in_a_bottle))

## Installation

### As Node.js module

    $ npm install flaschenpost

### As CLI

    $ npm install -g flaschenpost

## Quick start

First you need to integrate flaschenpost into your application.

```javascript
var flaschenpost = require('flaschenpost');
```

### In cloud applications

#### Using a logger

Next, call the `getLogger` function to acquire a logger. If you don't provide a parameter flaschenpost identifies the caller automatically.

```javascript
var logger = flaschenpost.getLogger();
```

In rare cases you need to specify the caller manually, e.g. if you wrap flaschenpost in your own logging module. In these cases, provide `__filename` as parameter.

```javascript
var logger = flaschenpost.getLogger(__filename);
```

Then you can use the functions `fatal`, `error`, `warn`, `info` and `debug` to write log messages. Simply provide the message you want to log as a parameter.

```javascript
logger.info('App started.');
```

##### Handling meta data

If you want to provide additional meta data, use an object as second parameter.

```javascript
logger.info('App started.', {
  name: 'foo',
  bar: {
    baz: 23
  }
});
```

##### Formatting log messages

If you want to use placeholders in the log message, embrace them in double curly braces. This way you can access any property of the meta data object.

```javascript
logger.info('App {{name}} started.', {
  name: 'foo'
});
```

Please note that you can use as many placeholders as you like.

##### Defining the log target

Unlike other loggers, flaschenpost only supports logging to the console. This is because a modern cloud-based application [never concerns itself with routing or storage of its output stream](http://12factor.net/logs).

When you are running an application using a TTY, the log messages will be written in a human-readable format. As soon as you redirect the output to a file or over the network, log messages are automatically written as JSON objects that can easily be processed by other tools.

#### Enabling and disabling log levels

By default, only the log levels `fatal`, `error`, `warn` and `info` are printed to the console. If you want to change this, set the environment variable `LOG_LEVELS` to the comma-separated list of desired log levels.

    $ export LOG_LEVELS=debug,info

If you want to enable all log levels at once, you can provide a `*` character as value for the `LOG_LEVELS` environment variable.

    $ export LOG_LEVELS=*

#### Setting custom log levels

If you want to change the default log levels, i.e. define other log levels, change colors or define which log levels are enabled by default, call the `use` function of flaschenpost.

```javascript
flaschenpost.use('levels', {
  fatal: {
    color: 'blue',
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

#### Using the Express middleware

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

#### Uncorking a flaschenpost

From time to time you may want to inspect log files that contain messages created by flaschenpost. For that, run the CLI tool and provide the log file via stdin.

    $ flaschenpost < foo.log

### In cli applications

#### Writing messages to the console

To write messages to the console, you need to call the `getCli` function to get a `cli` object. That object provides a number of functions to actually write messages.

Use the `success` and `error` functions to show that your application has succeeded or failed. If you want to provide additional information, use the `info` and `verbose` functions. In case of any warnings, use the `warn` function.

```javascript
var cli = flaschenpost.getCli();

cli.info('Updating...')
cli.success('Done.');
```

*Please note that `error` and `warn` write messages to the standard error stream, all other functions write them to the standard output stream.*

##### Formatting messages

If you want to use placeholders in the message, embrace them in double curly braces. This way you can access any property of an additional `options` object.

```javascript
cli.info('App {{name}} started.', {
  name: 'foo'
});
```

Please note that you can use as many placeholders as you like.

Besides, you can use the `options` object to change the prefix of the various message writing functions. For that, simply provide a `prefix` property and set it to the desired character.

```javascript
cli.error('App stopped.', { prefix: 'X' });
// => X App stopped.
```

#### Using lists

To write a list to the console use the `list` function. Optionally, you may specify an indentation level. Setting the indentation level to `0` is equal to omitting it.

```javascript
cli.list('foo');
cli.list('bar');
cli.list('baz', { indent: 1 });

// => ∙ foo
//    ∙ bar
//      ∙ baz
```

You may change the bullet character using the `prefix` property in the way described above.

#### Enabling verbose and quiet mode

By default, only messages written by `success`, `error`, `info` and `warn` are shown on the console. To enable `verbose` as well, provide the `--verbose` command line switch when running the application.

If you want to disable any output except `error` and `warn`, provide the `--quiet` command line switch.

#### Enabling and disabling colors

If you run a cli application in non-interactive mode, i.e. scripted, using colors is automatically being disabled. If you want to force usage of colors, provide the `--color` command line switch.

In turn, if you want to force disable colors even when in interactive mode, provide the `--no-color` command line switch.

#### Waiting for long-running tasks

If your application performs a long-running task, you may use the `waitFor` function to show a waiting indicator to the user.

```javascript
cli.waitFor(function (done) {
  // ...
  done();
});
```

*Please note that the loading indicator is written to the application's standard error stream.*

If you run the application using the `--quiet` command line switch, no loading indicator will be shown at all.

## Running the build

This module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, this also analyses the code. To run Grunt, go to the folder where you have installed flaschenpost and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2013-2015 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
