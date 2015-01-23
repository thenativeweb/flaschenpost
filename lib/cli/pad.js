'use strict';

var pad = function (value, width) {
  var spaces,
      valueAsString = '' + value,
      valueType = typeof value;

  if (valueAsString.length > width) {
    valueAsString = valueAsString.slice(0, width - 1) + '…';
  }

  spaces = new Array(width - valueAsString.length + 1).join(' ');

  if (valueType === 'number') {
    return spaces + valueAsString;
  }

  return valueAsString + spaces;
};

module.exports = pad;
