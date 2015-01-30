var util = require('util');
var createObjectMiddlewareClass = require('./object-class');
var replacePlaceholders = require('../replace-placeholders');

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

  return new ClassMiddleware(Class, key);
}