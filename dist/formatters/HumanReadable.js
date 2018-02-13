'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('stream'),
    Transform = _require.Transform;

var moment = require('moment'),
    stringifyObject = require('stringify-object');

var colorize = require('./colorize');

var HumanReadable = function (_Transform) {
  (0, _inherits3.default)(HumanReadable, _Transform);

  function HumanReadable(options) {
    (0, _classCallCheck3.default)(this, HumanReadable);

    options = options || {};
    options.objectMode = true;

    return (0, _possibleConstructorReturn3.default)(this, (HumanReadable.__proto__ || (0, _getPrototypeOf2.default)(HumanReadable)).call(this, options));
  }

  (0, _createClass3.default)(HumanReadable, [{
    key: '_transform',
    value: function _transform(chunk, encoding, callback) {
      var timestamp = moment.utc(chunk.timestamp);
      var origin = '',
          result = '';

      origin = '' + chunk.host;
      if (chunk.application) {
        // Be backward compatible and allow to parse logs without application data
        origin += '::' + chunk.application.name + '@' + chunk.application.version;
      }
      if (!chunk.application || chunk.application.name !== chunk.module.name) {
        // Do not print the same module information twice
        origin += '::' + chunk.module.name + '@' + chunk.module.version;
      }
      if (chunk.source) {
        origin += ' (' + chunk.source + ')';
      }

      result += colorize(chunk.message + ' (' + chunk.level + ')', chunk.level, 'bold');
      result += '\n';
      result += colorize(origin, 'white');
      result += '\n';
      result += colorize(timestamp.format('HH:mm:ss.SSS') + '@' + timestamp.format('YYYY-MM-DD') + ' ' + chunk.pid + '#' + chunk.id, 'gray');
      result += '\n';
      if (chunk.metadata) {
        result += colorize(stringifyObject(chunk.metadata, {
          indent: '  ',
          singleQuotes: true
        }).replace(/\\n/g, '\n'), 'gray');
        result += '\n';
      }
      result += colorize('\u2500'.repeat(process.stdout.columns || 80), 'gray');
      result += '\n';

      this.push(result);
      callback();
    }
  }]);
  return HumanReadable;
}(Transform);

module.exports = HumanReadable;