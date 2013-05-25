# flaschenpost

flaschenpost is a logger for distributed network applications.

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

var logger = flaschenpost.getLogger('foo');
```

Afterwards, you can use the functions `fatal`, `error`, `warn`, `info` and `debug`. You need to provide a `uuid` and a `message`. Optionally you can also specify a `metadata` object.

```javascript
logger.info('571f7ea7-aea3-4c51-b5ab-a23980e12859', 'bar', { bar: 'baz' });
```

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

*Note: A console logger is added automatically.*

## Running the tests

flaschenpost has been developed using TDD. To run the tests, go to the folder where you have installed flaschenpost to and run `npm test`. You need to have [mocha](https://github.com/visionmedia/mocha) installed.

    $ npm test

Additionally, this module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, Grunt also analyses the code using [JSHint](http://www.jshint.com/). To run Grunt, go to the folder where you have installed flaschenpost and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt