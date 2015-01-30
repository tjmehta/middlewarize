var express = require('express');
var mw = require('dat-middleware');
var next = function (req, res, next) {next();};

module.exports = function createAppWithMiddlewares (/* middlewares */) {
  var middlewares = Array.prototype.slice.call(arguments);

  var app = express();
  middlewares.forEach(function (middleware) {
    app.use(middleware);
  });
  app.use(mw.errorHandler({log:false}));

  return app;
};