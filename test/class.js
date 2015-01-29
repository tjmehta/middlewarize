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
  describe('new', function () {
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

  describe('static method', function () {
    describe('async', function () {
      it('should assign the async result to the specified key', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.asyncStatic('cb').async('result'),
          mw.res.send('result')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
      it('should assign the async result to the default key (if unspecified)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.asyncStatic('cb').async(),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
      it('should assign the async result to the default key (cb auto-async)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.asyncStatic('cb'),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
      it('should next error if async function errors', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.asyncError('cb'),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(500, { message: 'boom' }, count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(500, { message: 'boom' }, count.inc().next);
      });
      it('should error is used with a chain', function (done) {
        var cat = middlewarize(Cat);
        try {
          cat.asyncError('cb').new('garfield');
        }
        catch (err) {
          expect(err.message).to.equal('New (.new) cannot be used in a chain');
        }
        done();
      });
    });

    describe('sync', function () {
      it('should assign the async result to the specified key', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.syncStatic().sync('result'),
          mw.res.send('result')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
      it('should assign the async result to the default key (if unspecified)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.syncStatic().sync(),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
      it('should assign the async result to the default key (no-cb auto-sync)', function (done) {
        var cat = middlewarize(Cat);
        var app = createAppWithMiddlewares(
          cat.syncStatic(),
          mw.res.send('catResult')
        );
        var count = createCount(done);
        request(app)
          .get('/')
          .expect(200, 'static', count.inc().next);
        request(app) // twice to make sure the middlewares work multiple times..
          .get('/')
          .expect(200, 'static', count.inc().next);
      });
    });
  });
});