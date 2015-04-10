//watch hash change in projects
//dependencies
var childProcess = require('child_process'),
  fs = require('fs'),
  data = require('./data'),
  Project = require('./project');

var Watcher = module.exports = exports = function(projectOptions) {
  this.project = new Project(projectOptions);
  this.latestHead = null;
  this._checkInterval = 10000;

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
        callback(stdout);
      });
    };

    Watcher.prototype.shouldTrigger = function(callback) {
      data.getProjectHeads(this.project.name, function(err, heads) {
        if (err) {
          //TODO: better err handling
          throw err;
        }

        if (~heads.indexOf(this.head)) {
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

  var that = this;
  //check if project path exists.
  this.isPathExists(function(exist) {
    //TODO: better err handling
    if (!exist) {
      throw new Error('project path: ' + that.project.path + 'does not exist.');
    }
  });

  //get latest head
  this.getHead(function(head) {
    //TODO: What should be done when then head is not fetched ?
    that.setHead(head);
  });
};