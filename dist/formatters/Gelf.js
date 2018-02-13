'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var Gelf = function (_Transform) {
  (0, _inherits3.default)(Gelf, _Transform);

  function Gelf(options) {
    (0, _classCallCheck3.default)(this, Gelf);

    options = options || {};
    options.objectMode = true;

    var _this = (0, _possibleConstructorReturn3.default)(this, (Gelf.__proto__ || (0, _getPrototypeOf2.default)(Gelf)).call(this, options));

    _this.predefinedKeys = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file'];

    _this.mappedKeys = {
      message: 'short_message'
    };

    _this.defaultValues = {
      version: '1.1'
    };
    return _this;
  }

  (0, _createClass3.default)(Gelf, [{
    key: '_transform',
    value: function _transform(chunk, encoding, callback) {
      var _this2 = this;

      var result = (0, _assign2.default)({}, this.defaultValues);

      (0, _keys2.default)(chunk).forEach(function (key) {
        var mappedKey = void 0;

        if (_this2.predefinedKeys.includes(key)) {
          mappedKey = key;
        } else if (_this2.mappedKeys[key]) {
          mappedKey = _this2.mappedKeys[key];
        } else {
          mappedKey = '_' + key;
        }

        result[mappedKey] = chunk[key];
      });

      this.push((0, _stringify2.default)(result));
      callback();
    }
  }]);
  return Gelf;
}(Transform);

module.exports = Gelf;