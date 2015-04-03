//run tasks
//dependencies
var childProcess = require('child_process');

var task = module.exports = exports = {};

//Task instances include tasks information and functions 
//to exec commands.
task.Task = function(name, command) {
  this.name = name;
  this.command = command;
  this.resultData = '';
  this.runTask = function(callback) {
    //TODO: make spawn parameters more spacifically.
    var proc = childProcess.exec(command);

    //record running result.
    var that = this;
    proc.stdout.on('data', function(data) {
      that.resultData += data;
    });

    proc.on('close', function(code, signal) {
      callback(code, signal);
    });
  };
};

task.transform = function(commands) {
  var tasks = [];
  for (var command in commands) {

  }
  return tasks;
};