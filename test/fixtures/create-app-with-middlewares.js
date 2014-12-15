var express = require('express');
var mw = require('dat-middleware');
var next = function (req, res, next) {next();};

module.exports = function createAppWithMiddlewares (/* middlewares */) {
  var middlewares = Array.prototype.slice.call(arguments);

  var app = express();
  app.use(mw.log('yolo'));
  middlewares.forEach(function (middleware) {
    app.use(middleware);
  });
  app.use(function (err, req, res, next) {
    console.log(err.stack);
    next(err);
  });
  app.use(mw.errorHandler({log:false}));

  return app;
};