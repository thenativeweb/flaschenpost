# flaschenpost

flaschenpost is a logger for distributed network applications.

![flaschenpost](https://github.com/thenativeweb/flaschenpost/raw/master/images/logo.jpg "flaschenpost")

## Installation

At the moment, installation of this module must be made manually.

## Quick start

The first thing you need to do is to add a reference to the flaschenpost module and call its `setupNode` function to make the network node known to the logger.

Afterwards you can use the `getLogger` function to get a specific logger instance for the module you are currently working on.

```javascript
var flaschenpost = require('flaschenpost');
flaschenpost.setupNode({
  host: 'localhost',
  port: 3000,
  id: '12a30e3632a51fdab4fedd07bcc219b433e17343'
});

var logger = flaschenpost.getLogger({ module: 'foo', version: '0.0.1' });
```

Afterwards, you can use the functions `fatal`, `error`, `warn`, `info` and `debug`. You need to provide a `uuid` and a `message`. Optionally you can also specify a `metadata` object.

```javascript
logger.info('571f7ea7-aea3-4c51-b5ab-a23980e12859', 'bar', { bar: 'baz' });
```

### Using log levels

Usually, the log levels do have the following meanings:

- `fatal` is used to report unrecoverable errors that require the application to shutdown.
- `error` is used to report errors that *may* be recoverable, typically used inside error handlers.
- `warn` is used to report issues that *may* be a problem.
- `info` is used to report high-level workflow and state details.
- `debug` is used to report low-level workflow and state details.

### Adding and removing targets

To redirect log messages to specific targets, you need to register them on flaschenpost using the `pipe` function. Depending on the target, you may also need to give an `options` object to the constructor.

```javascript
flaschenpost.pipe(new flaschenpost.targets.Console());
```

To remove a target, you need to call the `unpipe` function and specify the target instance you created previously.

```javascript
var consoleTarget = new flaschenpost.targets.Console();
flaschenpost.pipe(consoleTarget);
// ...
flaschenpost.unpipe(consoleTarget);
```

*Note: A console target is added automatically when running in `development` mode.*

### Creating custom targets

To create a custom target all you need to do is to implement a [writable stream](http://nodejs.org/api/stream.html#stream_class_stream_writable_1) and enable `object mode`. Hence the following sample is the basic version of any target.

```javascript
'use strict';

var stream = require('stream'),
    util = require('util');

var Writable = stream.Writable;

var Target = function (options) {
  options = options || {};
  options.objectMode = true;

  Writable.call(this, options);
};

util.inherits(Target, Writable);

Target.prototype._write = function (chunk, encoding, callback) {
  // ...

  callback();
};

module.exports = Target;
```

Add your message handling logic inside the `_write` function. While the `chunk` parameter contains the log message object, you can safely ignore the `encoding` parameter. Once you are finished handling the log message, you must run the `callback` function.

The log message is given using the following format.

```javascript
{
  id: '0000000000000000000000000000000000000000',
  timestamp: 1385553628329,
  module: 'flaschenpost@0.0.1',
  node: {
    host: 'localhost',
    port: 3000,
    id: '12a30e3632a51fdab4fedd07bcc219b433e17343'
  },
  uuid: '1fd68e8d-10d0-4f56-b30d-6b88c02d1012',
  level: 'debug',
  message: 'foo',
  metadata: {}
}
```

*Note: If you did not call `setupNode`, flaschenpost will omit the `node` property of the log message.*

### Connecting to Express

In an Express based application you may use flaschenpost as logger for Express as well. For that you need to call the `middleware` function and hand its result over to the Express logger.

```javascript
app.use(express.logger(flaschenpost.middleware({
  module: 'foo/express',
  version: '0.0.1'
  uuid: 'b5b347b3-f9e0-4a2b-9444-0127f0d0e6bd'
})));
```

By default, all Express log messages are logged using the `info` log level.

## Running the build

This module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, this also analyses the code. To run Grunt, go to the folder where you have installed flaschenpost and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2013-2014 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
