var express = require('express');

var server = module.exports = exports = {};

server.start = function() {
  var app = express();
  var port = 9090;

  app.use(express.static(__dirname + '/../www/'));

  app.listen(port);
  console.log('server is running on ' + port);

  return app;
};