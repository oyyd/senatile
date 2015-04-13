var should = require('should'),
  task = require('../src/task');

describe('task', function() {
  describe('transform', function() {
    it('should return non-null tasks', function() {
      var tasks = {
        "karma": {
          "command": "karma start"
        },
        "jshint": {
          "command": "jshint ."
        }
      };

      var result = task.transform(tasks);

      (result.length > 0).should.be.true;
    });

    it('runTask', function(done) {
      //Task
      var aTask = new task.Task('test', 'ls');

      aTask.runTask('.', function(code, signal) {
        aTask.resultData.should.not.be.empty;
        done();
      });
    });
  });
});