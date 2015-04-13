//watch hash change in projects
//dependencies
var childProcess = require('child_process'),
  fs = require('fs'),
  async = require('async'),
  Project = require('./project');

var Watcher = module.exports = exports = function(projectOptions) {
  this.project = new Project(projectOptions);
  this.initialized = false;
  this.areTasksRunning = false;
  this._checkInterval = 5000;

  var that = this;

  if (!!!this.isPathExists) {
    Watcher.prototype.isPathExists = function(callback) {
      fs.exists(this.project.path, function(exist) {
        callback(exist);
      });
    };

    Watcher.prototype.setHead = function(head) {
      if (head) {
        this.project.head = head;
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
      if (!!!this.project.head) {
        this.getHead(function(head) {
          that.setHead(head);
          callback();
        });
      } else {
        callback();
      }
    };

    //TODO: cache project heads
    Watcher.prototype.shouldTrigger = function(callback) {
      console.log('check');
      var that = this;
      this.project.getHeads(function(err, heads) {
        if (err) {
          callback(err);
          return;
        }

        if (~heads.indexOf(that.project.head)) {
          callback(null, false);
          return;
        }
        callback(null, true);
      });
    };

    Watcher.prototype.runProjectTasks = function(callback) {
      if (this.areTasksRunning) {
        return;
      }

      var that = this;
      this.areTasksRunning = true;
      console.log('run tasks');
      this.project.runTasks(function(err) {
        that.areTasksRunning = false;
        callback(err);
      });
    };

    Watcher.prototype.logProject = function(cb) {
      console.log('log project');
      this.project.logTasks(cb);
    };

    //Loop to watch repo change
    Watcher.prototype.startWatch = function() {
      console.log('start watch');

      var that = this;
      var checkCommit = function() {
        if (that.areTasksRunning || !!!that.project.head || that.project.head === 'HEAD') {
          //TODO: better handling when project.head is null or 'HEAD';
          return;
        }
        console.log('watch');

        async.waterfall([function(cb) {
          //get head
          console.log('get head');
          that.getHead(function(head) {
            that.setHead(head);
            cb();
          });
        }, function(cb) {
          //check status
          console.log('check status');
          that.shouldTrigger(function(err, trigger) {
            console.log(trigger);
            cb(err, trigger);
          });
        }, function(trigger, cb) {
          console.log('should trigger ?');
          if (trigger) {
            console.log('Repo commited.');
            that.runProjectTasks(function(err) {
              if (err) {
                cb(err);
              } else {
                cb(null, true);
              }
            });
          } else {
            cb(null, false);
          }
        }, function(shouldLog, cb) {
          if (shouldLog) {
            that.logProject(function(err) {
              cb(err);
            });
            return;
          }
          cb(null);
        }], function(err) {
          if (err) {
            throw err;
          }
        });
      };

      checkCommit();
      var watchId = setInterval(checkCommit, this._checkInterval);

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