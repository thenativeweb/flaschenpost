'use strict';

const sanitizeMetadata = require('./sanitizeMetadata');

const Paragraph = function (id, data) {
  this.pid = process.pid;
  this.id = id;
  this.timestamp = Date.now();
  this.level = data.level;
  this.message = data.message;

  if (data.module) {
    this.module = data.module;
  }
  if (data.source) {
    this.source = data.source;
  }
  if (data.metadata) {
    this.metadata = sanitizeMetadata(data.metadata);
  }
};

module.exports = Paragraph;
