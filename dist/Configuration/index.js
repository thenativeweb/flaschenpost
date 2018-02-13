'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');

var cloneDeep = require('lodash/cloneDeep'),
    forEach = require('lodash/forEach'),
    forOwn = require('lodash/forOwn'),
    includes = require('lodash/includes'),
    keys = require('lodash/keys'),
    varname = require('varname');

var defaultLevels = require('../defaultLevels.json'),
    parseLogDebugModulesEnvironmentVariable = require('./parseLogDebugModulesEnvironmentVariable'),
    parseLogLevelsEnvironmentVariable = require('./parseLogLevelsEnvironmentVariable');

var Configuration = function () {
  function Configuration() {
    (0, _classCallCheck3.default)(this, Configuration);

    this.setLevels(cloneDeep(defaultLevels));
    this.setHost(os.hostname());

    this.debugModules = parseLogDebugModulesEnvironmentVariable();
  }

  (0, _createClass3.default)(Configuration, [{
    key: 'set',
    value: function set(key, options) {
      var fn = varname.camelback('set-' + key);

      if (!this[fn]) {
        throw new Error('Unknown key \'' + key + '\' specified.');
      }

      this[fn](options);
    }
  }, {
    key: 'setLevels',
    value: function setLevels(levels) {
      var _this = this;

      if (!levels) {
        throw new Error('Levels are missing.');
      }

      this.levels = levels;

      var enabledLogLevels = parseLogLevelsEnvironmentVariable();

      if (enabledLogLevels.length === 0) {
        return;
      }

      if (enabledLogLevels.length === 1 && enabledLogLevels[0] === '*') {
        enabledLogLevels = keys(this.levels);
      }

      forEach(enabledLogLevels, function (enabledLogLevel) {
        if (!includes(keys(_this.levels), enabledLogLevel)) {
          throw new Error('Unknown log level ' + enabledLogLevel + '.');
        }
      });

      forOwn(this.levels, function (levelOptions, levelName) {
        levelOptions.enabled = includes(enabledLogLevels, levelName);
      });
    }
  }, {
    key: 'setHost',
    value: function setHost(host) {
      if (!host) {
        throw new Error('Host is missing.');
      }

      this.host = host;
    }
  }]);
  return Configuration;
}();

module.exports = Configuration;