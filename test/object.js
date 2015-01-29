var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var mw = require('dat-middleware');
var request = require('supertest');
var createAppWithMiddlewares = require('./fixtures/create-app-with-middlewares');
var middlewarize = require('../index');
var createCount = require('callback-count');
var Cat = require('./fixtures/cat');

var obj = {
  asyncMethod: function (cb) {
    this.number++;
    cb(null, this.number.toString());
  },
  syncMethod: function () {
    return this.string;
  },
  number: 10,
  string: 'foo'
};

describe('object middlewarization', function () {
  it('should assign async result to the specified key', function (done) {
    var mwObj = middlewarize(obj, 'obj');
    var app = createAppWithMiddlewares(
      mwObj.asyncMethod('cb'),
      mw.res.send('objResult')
    );
    var count = createCount(done);
    request(app)
      .get('/')
      .expect(200, '11', count.inc().next);
    request(app) // twice to make sure the middlewares work multiple times..
      .get('/')
      .expect(200, '12', count.inc().next);
  });
  it('should assign sync result to the specified key', function (done) {
    var mwObj = middlewarize(obj, 'obj');
    var app = createAppWithMiddlewares(
      mwObj.syncMethod(),
      mw.res.send('objResult')
    );
    var count = createCount(done);
    request(app)
      .get('/')
      .expect(200, 'foo', count.inc().next);
    request(app) // twice to make sure the middlewares work multiple times..
      .get('/')
      .expect(200, 'foo', count.inc().next);
  });
  describe('setKey', function () {
    it('should assign sync result to the specified key', function (done) {
      var mwObj = middlewarize(obj, 'obj');
      var app = createAppWithMiddlewares(
        mwObj.setKey('obj1').syncMethod(),
        mw.res.send('obj1Result')
      );
      var count = createCount(done);
      request(app)
        .get('/')
        .expect(200, 'foo', count.inc().next);
      request(app) // twice to make sure the middlewares work multiple times..
        .get('/')
        .expect(200, 'foo', count.inc().next);
    });
  });
});

describe('instance', function () {
  it('should assign async result to the specified key', function (done) {
    var cat = middlewarize(new Cat('garfield'));
    var app = createAppWithMiddlewares(
      cat.getIsMammal(),
      mw.res.send('catResult')
    );
    var count = createCount(done);
    request(app)
      .get('/')
      .expect(200, 'true', count.inc().next);
    request(app) // twice to make sure the middlewares work multiple times..
      .get('/')
      .expect(200, 'true', count.inc().next);
  });
});