'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('stream'),
    Transform = _require.Transform;

var untildify = require('untildify');

var format = void 0;

var Custom = function (_Transform) {
  _inherits(Custom, _Transform);

  function Custom(options) {
    _classCallCheck(this, Custom);

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

    return _possibleConstructorReturn(this, (Custom.__proto__ || Object.getPrototypeOf(Custom)).call(this, options));
  }

  _createClass(Custom, [{
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