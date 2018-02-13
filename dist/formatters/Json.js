'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var Json = function (_Transform) {
  (0, _inherits3.default)(Json, _Transform);

  function Json(options) {
    (0, _classCallCheck3.default)(this, Json);

    options = options || {};
    options.objectMode = true;

    return (0, _possibleConstructorReturn3.default)(this, (Json.__proto__ || (0, _getPrototypeOf2.default)(Json)).call(this, options));
  }

  (0, _createClass3.default)(Json, [{
    key: '_transform',
    value: function _transform(chunk, encoding, callback) {
      this.push((0, _stringify2.default)(chunk) + '\n');
      callback();
    }
  }]);
  return Json;
}(Transform);

module.exports = Json;