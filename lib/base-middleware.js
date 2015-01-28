var i = require('i')();
var equals = require('101/equals');

module.exports = BaseMiddleware;

function BaseMiddleware (Class, key) { // uses Model and key from closure
  // constructor
  var middleware = function (req, res, next) {
    // sync and async were not used
    var cbWasUsedAsAnArg = middleware.methodChain.some(function (step) {
      return step.args.some(equals('cb'));
    });
    var resultKey = middleware.resultKey;
    if (cbWasUsedAsAnArg) {
      // assume async
      middleware.async(resultKey)(req, res, next);
    }
    else {
      middleware.sync(resultKey)(req, res, next);
    }
  };
  middleware.Class = Class;
  middleware.methodChain = [];
  middleware.__proto__ = this.__proto__;
  middleware.setKey = function (key) {
    if (Class.name) {
      key = i.camelize(Class.name, false);
    }
    key = key || Class.name;
    middleware.modelKey = key;
    middleware.resultKey = key+'Result';
    return middleware;
  };
  middleware.setKey(key);
  return middleware;
}
