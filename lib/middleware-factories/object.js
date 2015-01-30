var util = require('util');
var BaseMiddleware = require('../base-middleware');
var listFunctionKeys = require('../list-function-keys');
var createObjectMiddlewareClass = require('./object-class');

module.exports = createObjectMiddleware;

function createObjectMiddleware (obj, key) {
  var ObjectMiddleware = createObjectMiddlewareClass(obj, key);
  return new ObjectMiddleware();
}