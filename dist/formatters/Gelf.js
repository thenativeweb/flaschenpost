'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('stream'),
    Transform = _require.Transform;

var Gelf = function (_Transform) {
  _inherits(Gelf, _Transform);

  function Gelf(options) {
    _classCallCheck(this, Gelf);

    options = options || {};
    options.objectMode = true;

    var _this = _possibleConstructorReturn(this, (Gelf.__proto__ || Object.getPrototypeOf(Gelf)).call(this, options));

    _this.predefinedKeys = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file'];

    _this.mappedKeys = {
      message: 'short_message'
    };

    _this.defaultValues = {
      version: '1.1'
    };
    return _this;
  }

  _createClass(Gelf, [{
    key: '_transform',
    value: function _transform(chunk, encoding, callback) {
      var _this2 = this;

      var result = Object.assign({}, this.defaultValues);

      Object.keys(chunk).forEach(function (key) {
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

      this.push(JSON.stringify(result));
      callback();
    }
  }]);

  return Gelf;
}(Transform);

module.exports = Gelf;