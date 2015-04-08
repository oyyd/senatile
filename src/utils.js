//utils
var childProcess = require('child_process');

var utils = module.exports = exports = {};

utils.isGitExists = function(callback) {
  var runGitVersion = childProcess.spawn('git', ['version']);

  var result = '';
  runGitVersion.stdout.on('data', function(data) {
    result += data;
  });

  //TODO: add err handling
  runGitVersion.on('close', function(code, signal) {
    var exist = false;
    //TODO: is this right?
    if (~result.indexOf('git version')) {
      exist = true;
    }
    callback(null, exist);
  });
};