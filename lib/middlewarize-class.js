var createClassMiddleware = require('./middleware-factories/class');
var createInstanceMiddleware = require('./middleware-factories/instance');
var listFunctionKeys = require('./list-function-keys');

module.exports = middlewarizeClass;

function middlewarizeClass (Class, key) {
  var classMiddlewareFactoryMethods = {};

  listFunctionKeys(Class).forEach(function (method) {
    classMiddlewareFactoryMethods[method] = function () {
      var classMiddleware = createClassMiddleware(Class, key);
      classMiddleware[method].apply(classMiddleware, arguments);
      return classMiddleware;
    };
  });

  classMiddlewareFactoryMethods.new = function () {
    var classMiddleware = createClassMiddleware(Class, key);
    return classMiddleware.new.apply(classMiddleware, arguments);
  };

  classMiddlewareFactoryMethods.setKey = function () {
    var classMiddleware = createClassMiddleware(Class, key);
    return classMiddleware.setKey.apply(classMiddleware, arguments);
  };

  // model middleware
  //
  Object.defineProperty(
    classMiddlewareFactoryMethods,
    'instance', { get: instanceGetter });

  // instance aliases
  Object.defineProperty(
    classMiddlewareFactoryMethods,
    'i', { get: instanceGetter });

  Object.defineProperty(
    classMiddlewareFactoryMethods,
    'model', { get: instanceGetter });

  function instanceGetter () {
    var defaultInstanceMiddleware = createInstanceMiddleware(Class, key);

    function instanceMethod (key) {
      if (arguments.length === 3) { // use default instance middleware constructor
        var req  = arguments[0];
        var res  = arguments[1];
        var next = arguments[2];
        return defaultInstanceMiddleware(req, res, next);
      }
      else { // instance middleware factory
        return createInstanceMiddleware(Class, key);
      }
    }

    instanceMethod.__proto__ = defaultInstanceMiddleware;

    return instanceMethod;
  }

  return classMiddlewareFactoryMethods;
}