var createObjectMiddleware = require('./middleware-factories/object');
var listFunctionKeys = require('./list-function-keys');
var createObjectMiddleware = require('./middleware-factories/object');

module.exports = middlewarizeObject;

function middlewarizeObject (object, key) {
  key = key || object.constructor.name.toLowerCase();
  // apparently object.constructor.name defaults to ''
  if (!key) {
    throw new Error('Key is required for objects');
  }
  var objectMiddlewareFactoryMethods = {};

  listFunctionKeys(object).forEach(function (method) {
    objectMiddlewareFactoryMethods[method] = function () {
      var objectMiddleware = createObjectMiddleware(object, key);
      objectMiddleware[method].apply(objectMiddleware, arguments);
      return objectMiddleware;
    };
  });

  objectMiddlewareFactoryMethods.setKey = function () {
    var objectMiddleware = createObjectMiddleware(object, key);
    return objectMiddleware.setKey.apply(objectMiddleware, arguments);
  };

  return objectMiddlewareFactoryMethods;
}