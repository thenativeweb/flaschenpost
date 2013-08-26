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

### Adding and removing transports

To redirect log messages to specific targets, you need to register transports on flaschenpost using the `add` function. Besides the transport constructor, you also need to specify an `options` object. The concrete parameters depend on the transport used.

```javascript
flaschenpost.add(FooTransport, { bar: 'baz' });
```

To remove a transport, you need to call the `remove` function and specify the transport constructor.

```javascript
flaschenpost.remove(FooTransport);
```

The transports need to be compatible to the transports of the [winston](https://github.com/flatiron/winston) project.

*Note: A console logger is added automatically when running in `development` mode.*

### Parsing messages

flaschenpost creates log messages as a stringified JSON object.

```javascript
{
  id: '0000000000000000000000000000000000000000',
  timestamp: '2013-05-25T10:59:41.380Z',
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

*Note: If you did not call `setupNode`, flaschenpost will skip the `node` property.*

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

## Running the tests

flaschenpost has been developed using TDD. To run the tests, go to the folder where you have installed flaschenpost to and run `npm test`. You need to have [mocha](https://github.com/visionmedia/mocha) installed.

    $ npm test

Additionally, this module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, Grunt also analyses the code using [JSHint](http://www.jshint.com/). To run Grunt, go to the folder where you have installed flaschenpost and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt