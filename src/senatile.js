//main
//dependencies
var fs = require('fs'),
  Watcher = require('./watcher'),
  utils = require('./utils');

//check external dependencies
//Check the existing of git when initialized.
isGitExists(function(err, exist) {
  if (err) {
    //TODO: better err handling
    throw err;
  };

  if (!exist) {
    //TODO: better warning
    throw new Error('git not found');
  }
});

//load config
//TODO: handle invalid config file
try {
  var config = JSON.parse(fs.readFileSync('../senatile_config.json'));
} catch (err) {
  console.log(err);
  return;
}

console.log(config);

//start watching
var watchProjects = {};
for (var name in config.projects) {
  watchProjects[name] = config.projects[name];
};