var should = require('should'),
  Project = require('../src/project');

describe('Project', function() {
  describe('runTasks', function() {
    it('command ls should get result', function(done) {
      var options = {
        'name': 'test',
        "path": __dirname,
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

  describe('getHeads', function() {
    it('should get the length of heads that greeter than 0', function(done) {
      var options = {
        'name': 'test',
        'path': '',
        'tasks': {}
      };

      var aProject = new Project(options);
      aProject.getHeads(function(err, heads) {
        (heads.length > 0).should.be.true;
        done();
      });
    });
  });

  describe('logTasks', function() {
    //TODO:
  });

  describe('getTasksResult', function() {
    it('should return', function() {
      var options = {
        'name': 'test',
        'path': '',
        'tasks': {
          'test_task': {
            'command': 'git --version'
          }
        }
      };

      var aProject = new Project(options);
      aProject.runTasks(function(err) {
        aProject.tasks[0].resultData.should.not.be.empty;
      });
    });
  });
});