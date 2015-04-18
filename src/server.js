var express = require('express'),
  routes = require('./server/routes');

var server = module.exports = exports = {};

server.start = function(config) {
  var app = express();  

  var port = 9090;  

  app.use(express.static(__dirname + '/../www/'));

  routes(app);

  app.listen(port);
  console.log('server is running on ' + port);

  return app;
};