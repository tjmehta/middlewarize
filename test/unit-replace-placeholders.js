var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var replacePlaceholders = require('../lib/replace-placeholders');

describe('replace placeholder unit tests', function () {
  var ctx = {
    foo: 10,
    bar: 20
  };
  it('should replace strings (if they are existant keypath) in array', function (done) {
    var out = replacePlaceholders(ctx, ['foo', 'nope', 'bar']);
    expect(out).to.deep.equal([10, 'nope', 20]);
    done();
  });
  it('should replace string values (if they are existant keypaths) in objects', function (done) {
    var out = replacePlaceholders(ctx, { one: 'foo', two: 100, thr: 'bar' });
    expect(out).to.deep.equal({ one: 10, two: 100, thr: 20 });
    done();
  });
  it('should not do anything to a class instance', function (done) {
    var animal = new Animal();
    var out = replacePlaceholders(ctx, animal);
    expect(out).to.equal(animal);
    done();
  });
});

function Animal () {}