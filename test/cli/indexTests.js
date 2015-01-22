'use strict';

var assert = require('assertthat'),
    chalk = require('chalk'),
    isAnsi = require('isansi'),
    record = require('record-stdstreams');

var cli = require('../../lib/cli'),
    unicode = require('../../lib/cli/unicode');

suite('cli', function () {
  test('is an object.', function (done) {
    assert.that(cli, is.ofType('object'));
    done();
  });

  suite('blankLine', function () {
    test('is a function.', function (done) {
      assert.that(cli.blankLine, is.ofType('function'));
      done();
    });

    test('writes a blank line to stdout.', function (done) {
      record(function (stop) {
        cli.blankLine();
        stop();
      }, function (stdoutText) {
        assert.that(stdoutText, is.equalTo('\n'));
        done();
      });
    });

    test('does nothing when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stop) {
        cli.blankLine();
        stop();
      }, function (stdoutText) {
        assert.that(stdoutText, is.equalTo(''));
        process.argv.pop();
        done();
      });
    });
  });

  suite('success', function () {
    test('is a function.', function (done) {
      assert.that(cli.success, is.ofType('function'));
      done();
    });

    test('writes a message in green and bold to stdout.', function (done) {
      record(function (stop) {
        cli.success('foo');
        stop();
      }, function (stdoutText) {
        assert.that(isAnsi.green(stdoutText), is.true());
        assert.that(isAnsi.bold(stdoutText), is.true());
        done();
      });
    });

    test('writes a message with a check mark.', function (done) {
      record(function (stop) {
        cli.success('foo');
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo(unicode.checkMark + ' foo\n'));
        done();
      });
    });

    test('writes a stringified message if necessary.', function (done) {
      record(function (stop) {
        cli.success(23);
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo(unicode.checkMark + ' 23\n'));
        done();
      });
    });

    test('supports template strings.', function (done) {
      record(function (stop) {
        cli.success('foo {{bar}}', { bar: 'baz' });
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo(unicode.checkMark + ' foo baz\n'));
        done();
      });
    });

    test('does nothing when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stop) {
        cli.success('foo');
        stop();
      }, function (stdoutText) {
        assert.that(stdoutText, is.equalTo(''));
        process.argv.pop();
        done();
      });
    });
  });

  suite('error', function () {
    test('is a function.', function (done) {
      assert.that(cli.error, is.ofType('function'));
      done();
    });

    test('writes a message in red and bold to stderr.', function (done) {
      record(function (stop) {
        cli.error('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(isAnsi.red(stderrText), is.true());
        assert.that(isAnsi.bold(stderrText), is.true());
        done();
      });
    });

    test('writes a message with a cross.', function (done) {
      record(function (stop) {
        cli.error('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.crossMark + ' foo\n'));
        done();
      });
    });

    test('writes a stringified message if necessary.', function (done) {
      record(function (stop) {
        cli.error(23);
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.crossMark + ' 23\n'));
        done();
      });
    });

    test('supports template strings.', function (done) {
      record(function (stop) {
        cli.error('foo {{bar}}', { bar: 'baz' });
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.crossMark + ' foo baz\n'));
        done();
      });
    });

    test('still works when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stop) {
        cli.error('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.crossMark + ' foo\n'));
        process.argv.pop();
        done();
      });
    });
  });

  suite('warn', function () {
    test('is a function.', function (done) {
      assert.that(cli.warn, is.ofType('function'));
      done();
    });

    test('writes a message in yellow and bold to stderr.', function (done) {
      record(function (stop) {
        cli.warn('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(isAnsi.yellow(stderrText), is.true());
        assert.that(isAnsi.bold(stderrText), is.true());
        done();
      });
    });

    test('writes a message with an exclamation mark.', function (done) {
      record(function (stop) {
        cli.warn('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.rightPointingPointer + ' foo\n'));
        done();
      });
    });

    test('writes a stringified message if necessary.', function (done) {
      record(function (stop) {
        cli.warn(23);
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.rightPointingPointer + ' 23\n'));
        done();
      });
    });

    test('supports template strings.', function (done) {
      record(function (stop) {
        cli.warn('foo {{bar}}', { bar: 'baz' });
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.rightPointingPointer + ' foo baz\n'));
        done();
      });
    });

    test('still works when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stop) {
        cli.warn('foo');
        stop();
      }, function (stdoutText, stderrText) {
        assert.that(chalk.stripColor(stderrText), is.equalTo(unicode.rightPointingPointer + ' foo\n'));
        process.argv.pop();
        done();
      });
    });
  });

  suite('info', function () {
    test('is a function.', function (done) {
      assert.that(cli.info, is.ofType('function'));
      done();
    });

    test('writes a message in white to stdout.', function (done) {
      record(function (stop) {
        cli.info('foo');
        stop();
      }, function (stdoutText) {
        assert.that(isAnsi.white(stdoutText), is.true());
        done();
      });
    });

    test('writes a message with indentation.', function (done) {
      record(function (stop) {
        cli.info('foo');
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo('  foo\n'));
        done();
      });
    });

    test('writes a stringified message if necessary.', function (done) {
      record(function (stop) {
        cli.info(23);
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo('  23\n'));
        done();
      });
    });

    test('supports template strings.', function (done) {
      record(function (stop) {
        cli.info('foo {{bar}}', { bar: 'baz' });
        stop();
      }, function (stdoutText) {
        assert.that(chalk.stripColor(stdoutText), is.equalTo('  foo baz\n'));
        done();
      });
    });

    test('does nothing when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stop) {
        cli.info('foo');
        stop();
      }, function (stdoutText) {
        assert.that(stdoutText, is.equalTo(''));
        process.argv.pop();
        done();
      });
    });
  });

  suite('verbose', function () {
    test('is a function.', function (done) {
      assert.that(cli.verbose, is.ofType('function'));
      done();
    });

    suite('with --verbose set.', function () {
      setup(function () {
        process.argv.push('--verbose');
      });

      teardown(function () {
        process.argv.pop();
      });

      test('writes a message in gray to stdout.', function (done) {
        record(function (stop) {
          cli.verbose('foo');
          stop();
        }, function (stdoutText) {
          assert.that(isAnsi.gray(stdoutText), is.true());
          done();
        });
      });

      test('writes a message with indentation.', function (done) {
        record(function (stop) {
          cli.verbose('foo');
          stop();
        }, function (stdoutText) {
          assert.that(chalk.stripColor(stdoutText), is.equalTo('  foo\n'));
          done();
        });
      });

      test('writes a stringified message if necessary.', function (done) {
        record(function (stop) {
          cli.verbose(23);
          stop();
        }, function (stdoutText) {
          assert.that(chalk.stripColor(stdoutText), is.equalTo('  23\n'));
          done();
        });
      });

      test('supports template strings.', function (done) {
        record(function (stop) {
          cli.verbose('foo {{bar}}', { bar: 'baz' });
          stop();
        }, function (stdoutText) {
          assert.that(chalk.stripColor(stdoutText), is.equalTo('  foo baz\n'));
          done();
        });
      });

      test('does nothing when --quiet is set.', function (done) {
        process.argv.push('--quiet');
        record(function (stop) {
          cli.verbose('foo');
          stop();
        }, function (stdoutText) {
          assert.that(stdoutText, is.equalTo(''));
          process.argv.pop();
          done();
        });
      });
    });

    suite('without --verbose set.', function () {
      test('does not write a message to stdout.', function (done) {
        record(function (stop) {
          cli.verbose('foo');
          stop();
        }, function (stdoutText) {
          assert.that(stdoutText, is.equalTo(''));
          done();
        });
      });
    });
  });

  suite('waitFor', function () {
    test('is a function.', function (done) {
      assert.that(cli.waitFor, is.ofType('function'));
      done();
    });

    test('throws an error if worker is missing.', function (done) {
      assert.that(function () {
        cli.waitFor();
      }, is.throwing('Worker is missing.'));
      done();
    });

    test('shows a waiting indicator on stderr.', function (done) {
      record(function (stopRecording) {
        cli.waitFor(function (stopWaiting) {
          setTimeout(function () {
            stopWaiting();
            stopRecording();
          }, 0.2 * 1000);
        });
      }, function (stdoutText, stderrText) {
        assert.that(stdoutText, is.equalTo(''));
        assert.that(stderrText, is.not.equalTo(''));
        done();
      });
    });

    test('shows nothing when --quiet is set.', function (done) {
      process.argv.push('--quiet');
      record(function (stopRecording) {
        cli.waitFor(function (stopWaiting) {
          setTimeout(function () {
            stopWaiting();
            stopRecording();
          }, 0.2 * 1000);
        });
      }, function (stdoutText, stderrText) {
        assert.that(stdoutText, is.equalTo(''));
        assert.that(stderrText, is.equalTo(''));
        process.argv.pop();
        done();
      });
    });
  });
});
