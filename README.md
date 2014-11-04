# flaschenpost

flaschenpost logs messages to the console, either human-readable or as JSON.

> *A [/ˈflaʃənˌpɔst/](https://en.wiktionary.org/wiki/Flaschenpost) is a &bdquo;message written on a scrap of paper, rolled-up and put in an empty bottle and set adrift on the ocean; traditionally, a method used by castaways to advertise their distress to the outside world&rdquo;.* (from [Wiktionary](https://en.wiktionary.org/wiki/message_in_a_bottle))

## Installation

    $ npm install flaschenpost

## Quick start

First you need to integrate flaschenpost into your application.

```javascript
var flaschenpost = require('flaschenpost');
```

You need to provide the name and version of your application. For that call the `use` function and specify an appropriate object.

```javascript
flaschenpost.use('module', {
  name: 'foo',
  version: '0.0.1'
});
```

Please note that if you specify additional properties, these properties are ignored. This allows you to hand over your `package.json` file.

```javascript
flaschenpost.use('module', require('./package.json'));
```

### Using a logger

Once you have set up flaschenpost, you can call its `getLogger` function to acquire a logger.

```javascript
var logger = flaschenpost.getLogger();
```

If you want to use multiple loggers in your application, you may provide a string as parameter for `getLogger` that identifies the source from where you send log messages. This *may* be the name of the current file.

```javascript
var logger = flaschenpost.getLogger(__filename);
```

Then you can use the functions `fatal`, `error`, `warn`, `info` and `debug` to write log messages. Simply provide the message you want to log as a parameter.

```javascript
logger.info('App started.');
```

#### Formatting log messages

If you want to use placeholders in the log message, embrace them in double curly braces. Additionally, specify an object that contains the values.

```javascript
logger.info('App {{name}} started.', {
  name: 'foo'
});
```

You can use as many placeholders as you like. Values in the object that do not have a counterpart in the log message are ignored.

#### Handling meta data

If you want to provide additional meta data, add a `metadata` key to the parameter object and provide the meta data.

```javascript
logger.info('App {{name}} started.', {
  name: 'foo',
  metadata: {
    foo: 'bar',
    baz: 23
  }
});
```

### Enabling and disabling log levels

By default, only the log levels `fatal`, `error`, `warn` and `info` are printed to the console. If you want to change this, set the environment variable `LOG_LEVELS` to the comma-separated list of desired log levels.

    $ export LOG_LEVELS=debug,info

### Setting custom log levels

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

### Using the Express middleware

If you are writing an Express-based application and you use [morgan](https://github.com/expressjs/morgan) as logger, you can integrate flaschenpost.

For that provide the `stream` property when setting up morgan and call flaschenpost's `Middleware` constructor function with the desired log level.

```javascript
app.use(morgan('combined', {
  stream: new flaschenpost.Middleware('info')
}));
```

## Running the build

This module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, this also analyses the code. To run Grunt, go to the folder where you have installed flaschenpost and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2013-2014 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
