'use strict';

const Transform = require('stream').Transform;

/**
 * Duplex streams where the output is in some way computed from the input.
 * They implement both the Readable and Writable interfaces.
 * @extends {stream.Transform}
 * @see https://nodejs.org/api/stream.html#stream_class_stream_transform
 */
class Gelf extends Transform {

  /**
   * [constructor description]
   * @param {Object} options Passed to both Writable and Readable constructors
   * @param {Object} options.transform Implementation for the stream._transform() method.
   * @param {Object} options.flush Implementation for the stream._flush() method
   * @return {Gelf} The Transport stream for the GELF format
   */
  constructor (options) {
    options = options || {};
    options.objectMode = true;

    super(options);

    // Default keys based on GELF 2.0 - http://docs.graylog.org/en/2.0/pages/gelf.html
    this.GELF_STANDARD_KEYS = {
      version: true,
      host: true,
      short_message: true,
      full_message: true,
      timestamp: true,
      level: true,
      facility: true,
      line: true,
      file: true
    };
  }

  /**
   * Handles the bytes being written.
   * @override
   * @see https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback
   * @param  {Buffer|String} chunk The chunk to be transformed. Will always be a buffer unless the decodeStrings option was set to false.
   * @param  {String}   encoding If the chunk is a string, then this is the encoding type. If chunk is a buffer, then this is the special
   * value - 'buffer', ignore it in this case.
   * @param  {Function} callback Call this function (optionally with an error argument and data) when you are done processing the
   * supplied chunk.
   * @return {undefined}
   */
  _transform (chunk, encoding, callback) {
    let result = {};

    for (let key in chunk) {
      if (this.GELF_STANDARD_KEYS[key]) {
        result[key] = chunk[key];
      } else {
        // Non-standard keys must be prefixed
        result['_' + key] = chunk[key];
      }
    }

    this.push(JSON.stringify(result));
    callback();
  }
}

module.exports = Gelf;
