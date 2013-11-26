'use strict';

var looksLikeAnError = function (object) {
  return (typeof object === 'object') && !!object.name && !!object.message;
};

var behavesLikeES5Error =  function (object) {
  return !object.propertyIsEnumerable('name') && !object.propertyIsEnumerable('message');
};

var isError = function (object) {
  return looksLikeAnError(object) && behavesLikeES5Error(object);
};

module.exports = isError;
