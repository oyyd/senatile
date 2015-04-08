//watch hash change in projects
//dependencies
var childProcess = require('child_process'),
  fs = require('fs'),
  data = require('./data'),
  Project = require('./project');

var Watcher = module.exports = exports = function(projectOptions) {
  this.project = new Project(projectOptions);

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