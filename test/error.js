var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;
var middlewarize = require('../index');

describe('error', function () {
  it('should error if you middlewarize something unexpected', function (done) {
    try {
      middlewarize('string');
    }
    catch (err) {
      expect(err.message).to.match(/middlewarize/);
      done();
    }
  });
});

function Animal () {}