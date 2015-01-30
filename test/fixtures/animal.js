module.exports = Animal;

function Animal (isMammal) {
  this.isMammal = isMammal;
}
Animal.prototype.getIsMammal = function () {
  return this.isMammal;
};