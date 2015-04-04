//project
//dependencies
var async = require('async'),
  task = require('./task');

var Project = module.exports = exports = function(options) {
  this.path = options.path;
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
  }
};