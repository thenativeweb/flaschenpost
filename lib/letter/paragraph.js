'use strict';

var mark = require('markup-js');

var defaultModule = require('../../lib/defaults/module.json'),
    sanitizeMetadata = require('./sanitizeMetadata');

var paragraph = function (blueprint) {
  var writtenParagraph = {
    id: blueprint.id || 0,
    timestamp: blueprint.timestamp || new Date().getTime(),
    level: blueprint.level || 'info',
    message: mark.up(blueprint.message || '', blueprint.data)
  };

  writtenParagraph.module = blueprint.module || defaultModule;

  if (blueprint.source) {
    writtenParagraph.source = blueprint.source;
  }

  if (blueprint.data) {
    writtenParagraph.data = sanitizeMetadata(blueprint.data);
  }

  return writtenParagraph;
};

module.exports = paragraph;
