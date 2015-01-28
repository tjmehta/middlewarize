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
var CatNoName = require('./fixtures/cat-no-name');
var createAppWithMiddlewares = require('./fixtures/create-app-with-middlewares');
var middlewarize = require('../index');
var createCount = require('callback-count');

describe('class middlewarization', function () {

  describe('instance method', function() {
    describe('async', function() {
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
      it('should assign async results to default key (if unspecified)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.new('garfield'),
          cat.instance.asyncMeow('cb').async(),
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
      it('should callback error if async results in an error', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.new('garfield'),
          cat.instance.asyncError('cb').async('catNoise'),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(500, { message: 'boom (instance)' }, count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(500, { message: 'boom (instance)' }, count.inc().next);
      });
      describe('errors', function() {
        it('should error if instance does not exist on req', function (done) {
          var cat = middlewarize(Cat);
          var app = createAppWithMiddlewares(
            cat.instance.asyncMeow('cb').async('catNoise'),
            mw.res.send('catNoise')
          );
          var count = createCount(done);
          request(app)
            .get('/')
            .expect(500, /\(instance\) does not exist/, count.inc().next);
          request(app) // twice to make sure the middlewares work multiple times..
            .get('/')
            .expect(500, /\(instance\) does not exist/, count.inc().next);
        });
      });
    });

    describe('sync', function() {
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
      it('should assign sync result to default key (if unspecified)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.new('garfield'),
          cat.instance.syncMeow().sync(),
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
      describe('errors', function() {
        it('should error if instance does not exist on req', function (done) {
          var cat = middlewarize(Cat);
          var app = createAppWithMiddlewares(
            cat.instance.syncMeow().sync('catNoise'),
            mw.res.send('catNoise')
          );
          var count = createCount(done);
          request(app)
            .get('/')
            .expect(500, /\(instance\) does not exist/, count.inc().next);
          request(app) // twice to make sure the middlewares work multiple times..
            .get('/')
            .expect(500, /\(instance\) does not exist/, count.inc().next);
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

  describe('set key', function() {
    describe('instance method', function() {
      describe('async', function() {
        it('should assign async results to keys specified', function (done) {
          var cat = middlewarize(CatNoName);
          var app = createAppWithMiddlewares(
            cat.setKey('cat1').new('garfield'),
            cat.instance('cat1').asyncMeow('cb').async('catNoise'),
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
        it('should assign sync result to key specified', function (done) {
          var cat = middlewarize(CatNoName);
          var app = createAppWithMiddlewares(
            cat.setKey('cat1').new('garfield'),
            cat.instance('cat1').syncMeow().sync('catNoise'),
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
  });
});