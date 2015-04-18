var data = require(__dirname + '/../../data');

var projects = module.exports = exports = function(req, res){
  console.log('yes');
  data.getProjects(function(err, projects){
    res.send(projects);
  });
};