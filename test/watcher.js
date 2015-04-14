var should = require('should'),
  Watcher = require('../src/watcher'),
  Project = require('../src/project');

describe('Watcher', function() {
  describe('isPathExists', function() {
    it('should return true when path exists', function(done) {
      var projectOption = {
        "name": "test",
        "path": __dirname,
        "tasks": {
          "ls": {
            "command": "ls"
          }
        }
      };

      var watcher = new Watcher(projectOption);

      watcher.isPathExists(function(exists) {
        exists.should.be.true;
        done();
      });
    });

    it('should return false when path doesn\'t exists', function() {
      var watcher = new Watcher({
        "name": 'a_project_path_doesn\'t_exists',
        "path": './a_project_path_doesn\'t_exists',
        "tasks": []
      });

      watcher.isPathExists(function(exists) {
        exists.should.be.false;
        done();
      });
    });
  });

  describe('setHead', function() {
    var watcher = new Watcher({
      "name": 'test',
      "path": __dirname + '/test_folder',
      "tasks": []
    });
    it('should set head as \'test\'', function() {

      watcher.setHead('test');
      watcher.project.head.should.be.exactly('test');
    });

    it('should not set head if param is null', function() {
      watcher.setHead(null);
      watcher.project.head.should.be.exactly('test');
    });
  });

  describe('getHead', function() {
    it('should get the head of the testing project', function(done) {
      var watcher = new Watcher({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });

      watcher.getHead(function(head) {
        head.should.not.be.empty;
        done();
      });
    });
  });

  //TODO: control `initHead` and write tests
  // describe('initHead', function() {
  //   it('should init head', function(done) {
  //     var watcher = new Watcher({
  //       "name": 'test',
  //       "path": __dirname + '/test_folder',
  //       "tasks": []
  //     });
  //   });
  // });



  describe('shouldTrigger', function() {
    it('should trigger when head is different', function(done) {
      var watcher = new Watcher({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });

      watcher.setHead('a_head_that_doesn\'t exist');

      watcher.shouldTrigger(function(err, trigger) {
        trigger.should.be.true;
        done();
      });
    });

    it('should not trigger when head is same', function(done) {
      var watcher = new Watcher({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": []
      });

      watcher.setHead('e9c920cd2bab859c72944ba9869948d1d74a2f74');

      watcher.shouldTrigger(function(err, trigger) {
        trigger.should.be.false;
        done();
      });
    });
  });

  describe('runProjectTasks', function() {
    //TODO: add test when `areTasksRunning` is true
    it('should ', function(done) {
      var watcher = new Watcher({
        "name": 'test',
        "path": __dirname + '/test_folder',
        "tasks": {
          "git_version": {
            "command": "git --version"
          }
        }
      });

      watcher.runProjectTasks(function(err) {
        watcher.project.tasks[0].resultData.indexOf('git version').should.not.be.exactly(-1);
        done();
      });
    });
  });

  describe('logProject', function() {
    //TODO:
  });

  describe('startWatch', function() {
    //TODO:

  });

  describe('stopWatch', function() {
    //TODO:

  });

});