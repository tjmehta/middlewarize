var valIsFunction = require('./val-is-function');

module.exports = listFunctionKeys;

function listFunctionKeys (Class) {
  return Object.keys(Class).filter(valIsFunction(Class));
}