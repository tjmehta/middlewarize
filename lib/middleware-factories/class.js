var util = require('util');
var createObjectMiddlewareClass = require('./object-class');
var replacePlaceholders = require('../replace-placeholders');
var reduceSteps = require('../reduce-steps');

module.exports = createClassMiddlewareClass;

function createClassMiddlewareClass (Class, key) {
  var ObjectMiddleware = createObjectMiddlewareClass(Class, key);

  function ClassMiddleware () {
    return ObjectMiddleware.call(this, Class, key);
  }

  util.inherits(ClassMiddleware, ObjectMiddleware);
  /**
   * Class Constructor Middleware
   */
  ClassMiddleware.prototype.new = function () {
    if (this.methodChain.length) {
      throw new Error('New (.new) cannot be used in a chain');
    }
    var argsWithPlaceholders = Array.prototype.slice.call(arguments);
    var self = this;
    return function (req, res, next) {
      var args = replacePlaceholders(req, argsWithPlaceholders);
      req[self.modelKey] = new Class(args[0], args[1], args[2], args[3], args[4]);
      next();
    };
  };

  /**
   * Exec methods
   */
  ClassMiddleware.prototype.async = function (/* resultKeys */) {
    var self = this;
    var resultKeys = Array.prototype.slice.call(arguments);
    resultKeys[0] = resultKeys[0] || this.resultKey;
    console.log(resultKeys[0]);
    return function (req, res, next) {
      var reqWithCb = { cb: cb, __proto__: req };
      reduceSteps(reqWithCb, self.Class, self.methodChain);
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

  ClassMiddleware.prototype.sync = function (resultKey) {
    var self = this;
    resultKey = resultKey || this.resultKey;
    return function (req, res, next) {
      var result = reduceSteps(req, self.Class, self.methodChain);
      req[resultKey] = result;
      next();
    };
  };

  return new ClassMiddleware(Class, key);
}