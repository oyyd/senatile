var routes = module.exports = exports = function(app) {
  app.get('/projects', require('./project/projects'));
};