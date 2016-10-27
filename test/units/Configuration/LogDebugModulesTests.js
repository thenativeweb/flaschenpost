'use strict';

const path = require('path');

const assert = require('assertthat'),
      nodeenv = require('nodeenv'),
      shell = require('shelljs');

suite('LOG_LEVELS and LOG_DEBUG_MODULES', () => {
  test('debug disabled', done => {
    nodeenv({
      LOG_LEVELS: undefined,
      LOG_DEBUG_MODULES: undefined
    }, restore => {
      shell.exec('node writeDebugMessage.js', {
        cwd: path.join(__dirname, '..', '..', 'helpers')
      }, (code, stdout, stderr) => {
        assert.that(code).is.equalTo(0);
        assert.that(stdout).is.equalTo('');
        assert.that(stderr).is.equalTo('');
        restore();
        done();
      });
    });
  });

  test('all log levels enabled', done => {
    nodeenv({
      LOG_LEVELS: '*',
      LOG_DEBUG_MODULES: undefined
    }, restore => {
      shell.exec('node writeDebugMessage.js', {
        cwd: path.join(__dirname, '..', '..', 'helpers')
      }, (code, stdout, stderr) => {
        assert.that(code).is.equalTo(0);
        assert.that(stdout).is.not.equalTo('');
        assert.that(stderr).is.equalTo('');
        restore();
        done();
      });
    });
  });

  test('debug enabled', done => {
    nodeenv({
      LOG_LEVELS: 'debug',
      LOG_DEBUG_MODULES: undefined
    }, restore => {
      shell.exec('node writeDebugMessage.js', {
        cwd: path.join(__dirname, '..', '..', 'helpers')
      }, (code, stdout, stderr) => {
        assert.that(code).is.equalTo(0);
        assert.that(stdout).is.not.equalTo('');
        assert.that(stderr).is.equalTo('');
        restore();
        done();
      });
    });
  });

  test('restricted by module', done => {
    nodeenv({
      LOG_LEVELS: 'debug',
      LOG_DEBUG_MODULES: 'other'
    }, restore => {
      shell.exec('node writeDebugMessage.js', {
        cwd: path.join(__dirname, '..', '..', 'helpers')
      }, (code, stdout, stderr) => {
        assert.that(code).is.equalTo(0);
        assert.that(stdout).is.equalTo('');
        assert.that(stderr).is.equalTo('');
        restore();
        done();
      });
    });
  });
});
