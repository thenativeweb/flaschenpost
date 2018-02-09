'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('stream'),
    Transform = _require.Transform;

var moment = require('moment'),
    stringifyObject = require('stringify-object');

var colorize = require('./colorize');

var HumanReadable = function (_Transform) {
  _inherits(HumanReadable, _Transform);

  function HumanReadable(options) {
    _classCallCheck(this, HumanReadable);

    options = options || {};
    options.objectMode = true;

    return _possibleConstructorReturn(this, (HumanReadable.__proto__ || Object.getPrototypeOf(HumanReadable)).call(this, options));
  }

  _createClass(HumanReadable, [{
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