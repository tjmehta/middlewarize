var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var mw = require('dat-middleware');
var request = require('supertest');
var Cat = require('./fixtures/cat');
var createAppWithMiddlewares = require('./fixtures/create-app-with-middlewares');
var middlewarize = require('../index');
var createCount = require('callback-count');

describe('class middlewarization', function () {
  describe('new', function() {
    it('should create an instance of the class on req', function (done) {
      var cat = middlewarize(Cat);
      var app = createAppWithMiddlewares(
        cat.new('garfield'),
        mw.res.send('cat.name')
      );
      var count = createCount(done);
      request(app)
        .get('/')
        .expect(200, 'garfield', count.inc().next);
      request(app) // twice to make sure the middlewares work multiple times..
        .get('/')
        .expect(200, 'garfield', count.inc().next);
    });
  });
  describe('instance method', function() {
    describe('async', function() {
      // it('require that async is called after the instance method', function (done) {
      // });
      it('should assign async results to keys specified', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.new('garfield'),
          cat.instance.asyncMeow('cb').async('catNoise'),
          mw.res.send('catNoise')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'meow1', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'meow1', count.inc().next);
      });
    });
    describe('sync', function() {
      // it('require that async is called after the instance method', function (done) {
      // });
      it('should assign sync result to key specified', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.new('garfield'),
          cat.instance.syncMeow().sync('catNoise'),
          mw.res.send('catNoise')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'meow1', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'meow1', count.inc().next);
      });
    });
  });

  describe('no async or sync', function() {
    it('should default to sync if cb not used as an arg', function (done) {
      var cat = middlewarize(Cat);
      var app = createAppWithMiddlewares(
        cat.new('garfield'),
        cat.instance.syncMeow(),
        mw.res.send('catResult')
      );
      var count = createCount(done);
      request(app)
        .get('/')
        .expect(200, 'meow1', count.inc().next);
      request(app) // twice to make sure the middlewares work multiple times..
        .get('/')
        .expect(200, 'meow1', count.inc().next);
    });
  });
  it('should default to async if cb is used as an arg', function (done) {
    var cat = middlewarize(Cat);
    var app = createAppWithMiddlewares(
      cat.new('garfield'),
      cat.instance.asyncMeow('cb'),
      mw.res.send('catResult')
    );
    var count = createCount(done);
    request(app)
      .get('/')
      .expect(200, 'meow1', count.inc().next);
    request(app) // twice to make sure the middlewares work multiple times..
      .get('/')
      .expect(200, 'meow1', count.inc().next);
  });
});