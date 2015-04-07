var should = require('should'),
  data = require('../src/data');

describe('data', function() {
  describe('getProject', function() {
    it('should get empty object when file doesn\'t exist', function(done) {
      data.getProject('projectThatNotExist', function(err, project) {
        project.should.be.empty;
        done();
      });
    });

    it('should get JSON from test.json', function(done) {
      data.getProject('test', function(err, project) {
        project.should.not.be.empty;
        done();
      });
    });
  });

  describe('setProject', function() {
    it('should set project without err', function(done) {
      data.setProject('test', '12312312312312abasdfasdf', {
        "karma": "result string",
        "jshint": "result string"
      }, function(err) {
        (err == null).should.be.true;
        done();
      });
    });
  });

  describe('getProjectHeads', function() {
    it('should get heads', function(done) {
      data.getProjectHeads('test', function(err, heads) {
        (heads.length > 0).should.be.true;
        done();
      });
    });
  });
});