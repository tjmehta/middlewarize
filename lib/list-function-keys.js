var valIsFunction = require('./val-is-function');

module.exports = listFunctionKeys;

function listFunctionKeys (thing) {
  var allKeys = [].concat(Object.keys(thing));
  // do
  var proto = Object.getPrototypeOf(thing);
  var keys = Object.keys(proto);
  while (keys.length) {
    allKeys = allKeys.concat(keys);
    proto = Object.getPrototypeOf(proto);
    keys  = Object.keys(proto);
  }
  // reverse so that lower proto is overridden by highest
  allKeys.reverse();
  return allKeys.filter(valIsFunction(thing));
}