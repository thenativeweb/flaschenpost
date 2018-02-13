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
    Writable = _require.Writable;

var stackTrace = require('stack-trace');

var Middleware = function (_Writable) {
  (0, _inherits3.default)(Middleware, _Writable);

  function Middleware(level, source) {
    (0, _classCallCheck3.default)(this, Middleware);

    if (!level) {
      throw new Error('Level is missing.');
    }

    /* eslint-disable global-require */
    var flaschenpost = require('../flaschenpost');
    /* eslint-enable global-require */

    var options = {};

    options.objectMode = true;
    options.source = source || stackTrace.get()[1].getFileName();

    var _this = (0, _possibleConstructorReturn3.default)(this, (Middleware.__proto__ || (0, _getPrototypeOf2.default)(Middleware)).call(this, options));

    _this.level = level;
    _this.logger = flaschenpost.getLogger(options.source);

    if (!_this.logger[_this.level]) {
      throw new Error('Level is invalid.');
    }
    return _this;
  }

  (0, _createClass3.default)(Middleware, [{
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      this.logger[this.level](chunk);
      callback();
    }
  }]);
  return Middleware;
}(Writable);

module.exports = Middleware;