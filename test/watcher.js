var should = require('should'),
  Watcher = require('../src/watcher'),
  Project = require('../src/project');

describe('Watcher', function() {
  describe('isPathExists', function() {
    it('should return true when path exists', function(done) {
      var projectOption = {
        "name": "test",
        "path": '/home/oyyd/code/github/senatile/test/',
        "tasks": {
          "ls": {
            "command": "ls"
          }
        }
      };

      var project = new Project(projectOption);
      var watcher = new Watcher(project);

      watcher.isPathExists(function(exists) {
        exists.should.be.true;
        done();
      });
    });

    it('should return false when path doesn\'t exists', function() {
      var project = new Project({
        "name": 'a_project_path_doesn\'t_exists',
        "path": './a_project_path_doesn\'t_exists',
        "tasks": []
      });

      var watcher = new Watcher(project);

      watcher.isPathExists(function(exists) {
        exists.should.be.false;
        done();
      });
    });
  });

  describe('getHead', function() {
    it('should get the head of the testing project', function(done) {
      var project = new Project({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });
      var watcher = new Watcher(project);

      watcher.getHead(function(head) {
        head.should.not.be.empty;
        done();
      });
    });
  });

  describe('shouldTrigger', function() {
    it('should trigger when head is different', function(done) {
      var head = 'a_head_that_not_same';
      var project = new Project({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });
      var watcher = new Watcher(project);

      watcher.shouldTrigger(head, function(trigger) {
        trigger.should.be.true;
        done();
      });
    });

    it('should not trigger when head is same', function(done) {
      var head = 'e9c920cd2bab859c72944ba9869948d1d74a2f74';

      var project = new Project({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });
      var watcher = new Watcher(project);

      watcher.shouldTrigger(head, function(trigger) {
        trigger.should.be.false;
        done();
      });
    });
  });
});