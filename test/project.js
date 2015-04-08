var should = require('should'),
  Project = require('../src/project');

describe('Project', function() {
  describe('runTasks', function() {
    it('command ls should get result', function(done) {
      var options = {
        'name': 'test',
        "path": '/home/oyyd/code/github/senatile/test/',
        "tasks": {
          "ls": {
            "command": "ls"
          }
        }
      };

      var aProject = new Project(options);

      aProject.runTasks(function(err) {
        aProject.tasks[0].resultData.should.not.be.empty;
        done();
      });
    });
  });
});