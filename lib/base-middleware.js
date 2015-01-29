var i = require('i')();
var equals = require('101/equals');
var reduceSteps = require('./reduce-steps');

module.exports = BaseMiddleware;

function BaseMiddleware (original, key) { // uses Model and key from closure
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
  middleware.original = original;
  middleware.methodChain = [];
  middleware.__proto__ = this.__proto__;
  middleware.setKey = function (key) {
    if (!key && original.name) {
      key = i.camelize(original.name, false);
    }
    middleware.modelKey = key;
    middleware.resultKey = key+'Result';
    return middleware;
  };
  middleware.setKey(key);
  return middleware;
}

/**
 * Exec methods
 */
BaseMiddleware.prototype.async = function (/* resultKeys */) {
  var self = this;
  var resultKeys = Array.prototype.slice.call(arguments);
  resultKeys[0] = resultKeys[0] || this.resultKey;
  return function (req, res, next) {
    var reqWithCb = { cb: cb, __proto__: req };
    reduceSteps(reqWithCb, self.original, self.methodChain, self.modelKey);
    function cb (err) {
      if (err) { return next(err); }
      var results = Array.prototype.slice.call(arguments, 1);
      resultKeys.forEach(function (key) {
        req[key] = results.shift();
      });
      next();
    }
  };
};

BaseMiddleware.prototype.sync = function (resultKey) {
  var self = this;
  resultKey = resultKey || this.resultKey;
  return function (req, res, next) {
    var result = reduceSteps(req, self.original, self.methodChain, self.modelKey);
    req[resultKey] = result;
    next();
  };
};