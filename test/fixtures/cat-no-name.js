var Cat = module.exports = function (name) {
  this.name = name;
  this.meowCount = 0;
};
Cat.prototype.asyncMeow = function (cb) {
  var self = this;
  process.nextTick(function () {
    self.meowCount++;
    cb(null, 'meow'+self.meowCount);
  });
};
Cat.prototype.syncMeow = function () {
  this.meowCount++;
  return 'meow'+this.meowCount;
};