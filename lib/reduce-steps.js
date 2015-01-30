var replacePlaceholders = require('./replace-placeholders');

module.exports = reduceSteps;

function reduceSteps (req, memo, steps, modelKey) {
  var currStep;
  try {
    var result = steps.reduce(function (result, step) {
      currStep = step; // for better errors
      var args = replacePlaceholders(req, step.args);
      return result[step.method].apply(result, args);
    }, memo);
    return result;
  }
  catch (err) {
    var rootPath = modelKey;
    var fullPath = steps.reduce(function (memo, step) {
      return memo + '.' + step.method;
    }, rootPath.toLowerCase());
    throw new Error(currStep.method+' failed for '+fullPath+': '+err.message);
  }
}