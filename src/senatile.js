//main

//dependencies
var fs = require('fs');

//load config
//TODO: handle invalid config file
var config = JSON.parse(fs.readFileSync('../senatile_config.json'));

console.log(config);

//start watching
var watchProjects = [];
for (var project in config.projects) {

}