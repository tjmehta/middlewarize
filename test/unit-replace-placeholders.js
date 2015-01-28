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

describe('replace placeholder unit tests', function () {

})