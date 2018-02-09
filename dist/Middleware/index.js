'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('stream'),
    Writable = _require.Writable;

var stackTrace = require('stack-trace');

var Middleware = function (_Writable) {
  _inherits(Middleware, _Writable);

  function Middleware(level, source) {
    _classCallCheck(this, Middleware);

    if (!level) {
      throw new Error('Level is missing.');
    }

    /* eslint-disable global-require */
    var flaschenpost = require('../flaschenpost');
    /* eslint-enable global-require */

    var options = {};

    options.objectMode = true;
    options.source = source || stackTrace.get()[1].getFileName();

    var _this = _possibleConstructorReturn(this, (Middleware.__proto__ || Object.getPrototypeOf(Middleware)).call(this, options));

    _this.level = level;
    _this.logger = flaschenpost.getLogger(options.source);

    if (!_this.logger[_this.level]) {
      throw new Error('Level is invalid.');
    }
    return _this;
  }

  _createClass(Middleware, [{
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      this.logger[this.level](chunk);
      callback();
    }
  }]);

  return Middleware;
}(Writable);

module.exports = Middleware;