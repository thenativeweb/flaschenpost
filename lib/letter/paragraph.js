'use strict';

var mark = require('markup-js');

var defaultModule = require('../../lib/defaultModule.json'),
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

  // Make this function idempotent so we can re-inject a paragraph object as a
  // blueprint. This allows bin/uncork-flaschenpost.js to parse any JSON object
  // that happens to contain any subset of the paragraph's properties.
  // @scherermichael
  if (blueprint.metadata) {
    writtenParagraph.metadata = sanitizeMetadata(blueprint.metadata);
  }

  if (blueprint.data && blueprint.data.metadata) {
    writtenParagraph.metadata = sanitizeMetadata(blueprint.data.metadata);
  }

  return writtenParagraph;
};

module.exports = paragraph;
