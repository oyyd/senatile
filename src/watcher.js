//watch hash change in projects
//dependencies
var childProcess = require('child_process'),
  fs = require('fs'),
  async = require('async'),
  data = require('./data'),
  Project = require('./project');

var Watcher = module.exports = exports = function(projectOptions) {
  this.project = new Project(projectOptions);
  this.latestHead = null;
  this.initialized = false;
  this._checkInterval = 10000;

  var that = this;

  if (!!!this.isPathExists) {
    Watcher.prototype.isPathExists = function(callback) {
      fs.exists(this.project.path, function(exist) {
        callback(exist);
      });
    };

    Watcher.prototype.setHead = function(head) {
      if (head) {
        this.latestHead = head;
      }
    };

    Watcher.prototype.getHead = function(callback) {
      var getHeadProc = childProcess.exec('git rev-parse HEAD', {
        //TODO: better options
        'cwd': this.project.path
      }, function(err, stdout, stderr) {
        //TODO: better error handling
        callback(stdout.trim());
      });
    };

    Watcher.prototype.initHead = function(callback) {
      var that = this;
      if (!!!this.latestHead) {
        this.getHead(function(head) {
          that.setHead(head);
          callback();
        });
      } else {
        callback();
      }
    };

    Watcher.prototype.shouldTrigger = function(callback) {
      var that = this;
      data.getProjectHeads(this.project.name, function(err, heads) {
        if (err) {
          //TODO: better err handling
          throw err;
        }

        if (~heads.indexOf(that.latestHead)) {
          callback(false);
          return;
        }
        callback(true);
      });
    };

    Watcher.prototype.runProjectTasks = function(callback) {
      this.project.runTasks(function(err) {
        callback(err);
      });
    };

    //Loop to watch repo change
    Watcher.prototype.startWatch = function() {
      var that = this;
      var watchId = setInterval(function() {
        if (!!!that.latestHead) {
          //TODO: better handling when latestHead is null;
          console.log('Getting the head..');
          return;
        }

        that.shouldTrigger(function(trigger) {
          if (trigger) {
            that.runProjectTasks(function(err) {
              if (err) {
                //TODO:
                console.log(err);
              }
            });
          }
        });
      }, this._checkInterval);

      return watchId;
    };

    Watcher.prototype.stopWatch = function(watchId) {
      //TODO: callbacks may return after the stopping watch.
      clearInterval(watchId);
    };
  }

  //check if project path exists.
  async.waterfall([function(cb) {
    that.isPathExists(function(exist) {
      if (!exist) {
        cb(new Error('project path: ' + that.project.path + 'does not exist.'));
      } else {
        cb(null);
      }
    });
  }, function() {
    that.initHead(function() {
      that.initialized = true;
    });
  }], function(err) {
    //TODO: better err handling
    throw err;
  });
};