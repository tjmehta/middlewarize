var isFunction = require('101/is-function');

module.exports = valIsFunction;

function valIsFunction (ctx) {
  return function (key) {
    return isFunction(ctx[key]);
  };
}