var util = require('util');
var BaseMiddleware = require('../base-middleware');
var listFunctionKeys = require('../list-function-keys');
var reduceSteps = require('../reduce-steps');


module.exports = createInstanceMiddlewareClass;

function createInstanceMiddlewareClass (Class, key) {

  function InstanceMiddleware (Class, key) { // uses Class and key from closure
    return BaseMiddleware.call(this, Class, key);
  }
  util.inherits(InstanceMiddleware, BaseMiddleware);

  /**
   * Class methods
   */
  listFunctionKeys(Class.prototype).forEach(function (method) {
    InstanceMiddleware.prototype[method] = function () {
      this.methodChain.push({
        method: method,
        args: Array.prototype.slice.call(arguments)
      });

      return this;
    };
  });

  /**
   * Exec methods
   */
  InstanceMiddleware.prototype.async = function (/* resultKeys */) {
    var self = this;
    var resultKeys = Array.prototype.slice.call(arguments);
    resultKeys[0] = resultKeys[0] || this.resultKey;
    return function (req, res, next) {
      var instance = req[self.modelKey];
      if (!instance) {
        throw new Error(self.modelKey + ' (instance) does not exist. (forget to instantiate an instance with .new?)')
      }
      var reqWithCb = { cb: cb, __proto__: req };
      reduceSteps(reqWithCb, instance, self.methodChain, self.modelKey);
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

  InstanceMiddleware.prototype.sync = function (resultKey) {
    var self = this;
    resultKey = resultKey || this.resultKey;
    return function (req, res, next) {
      var instance = req[self.modelKey];
      if (!instance) {
        throw new Error(self.modelKey + ' (instance) does not exist. (forget to instantiate an instance with .new?)')
      }
      var result = reduceSteps(req, instance, self.methodChain, self.modelKey);
      req[resultKey] = result;
      next();
    };
  };

  return new InstanceMiddleware(Class, key);
}