//main

//dependencies
var fs = require('fs'),
  Watcher = require('./watcher');

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