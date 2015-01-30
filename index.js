var isFunction = require('101/is-function');
var isObject = require('101/is-object');
var middlewarizeClass = require('./lib/middlewarize-class');
var middlewarizeObject = require('./lib/middlewarize-object');

module.exports = middlewarize;

function middlewarize (thing, key) {
  if (isFunction(thing)) {
    // assume thing is a class, for now
    return middlewarizeClass(thing, key);
  }
  else if (isObject(thing)) {
    return middlewarizeObject(thing, key);
  }
  else {
    throw new Error('middlewarize only works with classes and objects.');
  }
}