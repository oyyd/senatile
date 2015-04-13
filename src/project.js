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
      var that = this;
      async.each(this.tasks, function(task, callback) {
        task.runTask(that.path, function() {
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
      data.setProject(this.name, this.head, this.getTasksResult(), function(err) {
        cb(err);
      });
    };

    Project.prototype.getTasksResult = function() {
      var result = {};
      for (var index in this.tasks) {
        var task = this.tasks[index];
        result[task.name] = task.resultData;
      }

      return result;
    };
  }
};