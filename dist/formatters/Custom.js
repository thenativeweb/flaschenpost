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

var untildify = require('untildify');

var format = void 0;

var Custom = function (_Transform) {
  (0, _inherits3.default)(Custom, _Transform);

  function Custom(options) {
    (0, _classCallCheck3.default)(this, Custom);

    if (!options) {
      throw new Error('Options are missing.');
    }
    if (!options.js) {
      throw new Error('JavaScript is missing.');
    }

    /* eslint-disable global-require */
    format = require(untildify(options.js));
    /* eslint-enable global-require */

    options.objectMode = true;

    return (0, _possibleConstructorReturn3.default)(this, (Custom.__proto__ || (0, _getPrototypeOf2.default)(Custom)).call(this, options));
  }

  (0, _createClass3.default)(Custom, [{
    key: '_transform',
    value: function _transform(chunk, encoding, callback) {
      var result = format(chunk);

      this.push(result);
      callback();
    }
  }]);
  return Custom;
}(Transform);

module.exports = Custom;