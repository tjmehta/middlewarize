var isFunction = require('101/is-function');
var middlewarizeClass = require('./lib/middlewarize-class');
var middlewarizeObject = require('./lib/middlewarize-object');


module.exports = middlewarize;

function middlewarize (thing, key) {
  if (isFunction(thing)) { // assume function is a class
    return middlewarizeClass(thing, key);
  }
  else if (isObject(thing)) {
    return middlewarizeObject(thing, key);
  }
  else {
    throw new Error('middlewarize only works with classes and objects.');
  }
}