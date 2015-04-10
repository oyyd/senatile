//main
//dependencies
var fs = require('fs'),
  Watcher = require('./watcher'),
  utils = require('./utils');

var senatile = module.exports = exports = {};

senatile.init = function(config) {
  senatile.checkEnv();

  if (!(config instanceof Object)) {
    //load config
    //TODO: handle invalid config file
    try {
      var config = JSON.parse(fs.readFileSync('../senatile_config.json'));
    } catch (err) {
      throw err;
      return;
    }
  }
  //start watching
  var watchers = [];
  for (var name in config.projects) {
    var projectOption = Object.create(config.projects[name]);
    projectOption.name = name;

    var watcher = new Watcher(projectOption);
    watcher.startWatch();
    watchers.push(watchers);
  };

  return watchers;
};

senatile.checkEnv = function() {
  //check external dependencies
  //Check the existing of git when initialized.
  utils.isGitExists(function(err, exist) {
    if (err) {
      //TODO: better err handling
      throw err;
    };

    if (!exist) {
      //TODO: better warning
      throw new Error('git not found');
    }
  });
};