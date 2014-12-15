var util = require('util');
var BaseMiddleware = require('../base-middleware');
var listFunctionKeys = require('../list-function-keys');

module.exports = createObjectMiddlewareClass;

function createObjectMiddlewareClass (obj, key) {

  function ObjectMiddleware () { // obj, key from closure
    return BaseMiddleware.call(this, obj, key);
  }
  util.inherits(ObjectMiddleware, BaseMiddleware);

  /**
   * obj methods
   */
  listFunctionKeys(obj).forEach(function (method) {
    ObjectMiddleware.prototype[method] = function () {
      this.methodChain.push({
        method: method,
        args: Array.prototype.slice.call(arguments)
      });

      return this;
    };
  });

  return ObjectMiddleware;
}