'use strict';

const _ = require('lodash'),
    chalk = require('chalk');

const defaultLevels = require('../defaultLevels.json');

const map = {};

const getColorFor = function (colorOrLevel) {
  if (map[colorOrLevel]) {
    return map[colorOrLevel];
  }

  return colorOrLevel;
};

const colorize = function (text, colorOrLevel, style) {
  let result = chalk[getColorFor(colorOrLevel)](text);

  if (style) {
    result = chalk[style](result);
  }

  return result;
};

_.forOwn(defaultLevels, (levelOptions, levelName) => {
  map[levelName] = levelOptions.color;
});

module.exports = colorize;
