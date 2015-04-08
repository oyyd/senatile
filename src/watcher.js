//watch hash change in projects
//dependencies
var childProcess = require('child_process'),
  fs = require('fs'),
  data = require('./data');

var Watcher = module.exports = exports = function(project) {
  this.project = project;

  if (!!!this.isPathExists) {
    Watcher.prototype.isPathExists = function(callback) {
      fs.exists(this.project.path, function(exist) {
        callback(exist);
      });
    };

    Watcher.prototype.getHead = function(callback) {
      var getHeadProc = childProcess.exec('git rev-parse HEAD', {
        //TODO: better options
        'cwd': this.project.path
      }, function(err, stdout, stderr) {
        //TODO: better error handling
        callback(stdout);
      });
    };

    Watcher.prototype.shouldTrigger = function(head, callback) {
      data.getProjectHeads(this.project.name, function(err, heads) {
        if (err) {
          //TODO: better err handling
          throw err;
        }

        if (~heads.indexOf(head)) {
          callback(false);
          return;
        }
        callback(true);
      });
    };
  }

  var that = this;
  //check if project path exists.
  this.isPathExists(function(exist) {
    //TODO: better err handling
    if (!exist) {
      throw new Error('project path: ' + that.project.path + 'does not exist.');
    }
  });
};

//TODO: move isGitExists to another file.
function isGitExists(callback) {
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

//Check the existing of git when initialized.
isGitExists(function(err, exist) {
  if (err) {
    //TODO: better err handling
    throw err;
  };

  if (!exist) {
    //TODO: better warning
    throw new Error('git not found');
  }
});