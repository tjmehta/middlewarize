module.exports = Cat;

function Cat (name) {
  this.name = name;
  this.meowCount = 0;
}
Cat.syncStatic = function () {
  return 'static';
};
Cat.asyncStatic = function (cb) {
  cb(null, 'static');
};
Cat.asyncError = function (cb) {
  cb(new Error('boom'));
};
Cat.prototype.syncMeow = function () {
  this.meowCount++;
  return 'meow'+this.meowCount;
};
Cat.prototype.asyncMeow = function (cb) {
  var self = this;
  process.nextTick(function () {
    self.meowCount++;
    cb(null, 'meow'+self.meowCount);
  });
};
Cat.prototype.asyncError = function (cb) {
  cb(new Error('boom (instance)'));
};