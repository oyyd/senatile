//project
//dependencies
var async = require('async'),
  task = require('./task'),
  data = require('./data');

var Project = module.exports = exports = function(options) {
  this.name = options.name;
  this.path = options.path;
  this.head = null;
  this.tasks = task.transform(options.tasks);

  if (!this.runTasks) {
    Project.prototype.runTasks = function(cb) {
      async.each(this.tasks, function(task, callback) {
        task.runTask(function() {
          callback();
        });
      }, function(err) {
        if (err) {
          //TODO: proper err handling
          console.log(err);
        };
        cb(err);
      });
    };

    Project.prototype.getHeads = function(cb) {
      data.getProjectHeads(this.name, function(err, heads) {
        cb(err, heads);
      });
    };

    Project.prototype.logTasks = function(cb) {
      data.setProject(this.name, this.head, this.getTasksResult, function(err) {
        cb(err);
      });
    };

    Project.prototype.getTasksResult = function() {
      var result = {};
      for (var task in this.tasks) {
        result[task] = this.tasks[task]['resultData'];
      }

      return result;
    };
  }
};