var senatile = require('../src/senatile');

describe('senatile', function() {
  describe('constructor', function() {
    it('should return watchers when initialized from object', function() {
      var testConfig = {
        "projects": {
          "project1": {
            "path": __dirname + '/test_folder',
            "tasks": {
              "karma": {
                "command": "karma start"
              },
              "jshint": {
                "command": "jshint ."
              }
            }
          }
        }
      };

      var watchers = senatile.init(testConfig);
      (watchers.length === 1).should.be.true;
    });
  });
});