'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const humanReadableMessage = /^.+ \(.+\)\n.+::.+@\d+\.\d+\.\d+.* \(.+\)\n\d{2}:\d{2}:\d{2}\.\d{3}@\d{4}-\d{2}-\d{2} \d+#\d+\n([^─]*)?─+$/gm;

suite('uncork', () => {
  test('humanizes messages.', done => {
    shell.exec('node writeMessages.js | node ../../bin/flaschenpost-uncork.js', {
      cwd: path.join(__dirname, '..', 'helpers')
    }, (code, stdout, stderr) => {
      assert.that(code).is.equalTo(0);

      const matches = stdout.match(humanReadableMessage);

      assert.that(matches.length).is.equalTo(2);
      assert.that(stderr).is.equalTo('');
      done();
    });
  });
});
