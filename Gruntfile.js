'use strict';

var tourism = require('tourism');

module.exports = tourism({
  analyse: {
    server: [ '**/*.js', '!node_modules/**/*.js', '!coverage/**/*.js' ]
  },
  test: {
    server: [ 'test/**/*.js' ]
  }
});
