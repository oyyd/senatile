//data handle
var fs = require('fs'),
  async = require('async');

var data = module.exports = exports = {};

data.getProject = function(projectName, callback, isPath) {
  var path = isPath?prefixFile(projectName):filePath(projectName);

  console.log(path);

  isExist(path, function(exists) {
    if (!exists) {
      callback(null, {});
    } else {
      data._getFile(path, function(err, projectObj) {
        callback(err, projectObj);
      });
    }
  });
};

data.getProjects = function(cb){
  var projects = [];
  fs.readdir(__dirname + '/../data', function(err, files){
    if(err){
      cb(err);
      return;
    }

    async.each(files, function(file, callback){
      data.getProject(file, function(err, projectObj){
        if(projectObj){
          projects.push(projectObj);
        }
        callback(err);        
      }, true);
    }, function(err){
      cb(err, projects);
    });
  });
};

data._getFile = function(path, callback) {
  fs.readFile(path, {
    encoding: 'utf8'
  }, function(err, data) {
    if (err) {
      //TODO: handle err better
      callback(err);
      return;
    };

    if (!!!data) {
      callback(null, {});
      return;
    };

    var project = null;
    try {
      project = JSON.parse(data);
    } catch (err) {
      callback(err);
      return;
    }

    callback(null, project);
  });
};

data.setProject = function(projectName, head, tasksResult, callback) {
  async.waterfall([function(callback) {
    // get project info
    data.getProject(projectName, function(err, projectObj) {
      callback(err, projectObj);
    });
  }, function(projectObj, callback) {
    var result = projectObj[head] = {};
    result.timestamp = Date.now();
    result.tasksResult = {};

    // compose new object 
    for (var taskName in tasksResult) {
      result.tasksResult[taskName] = tasksResult[taskName];
    }

    var resultStr = JSON.stringify(projectObj);

    // write info into file
    fs.writeFile(filePath(projectName), resultStr, function(err) {
      callback(err);
    });
  }], function(err) {
    callback(err);
  });
};

data.getProjectHeads = function(projectName, callback) {
  data.getProject(projectName, function(err, projectObj) {
    if (err) {
      callback(err);
      return;
    }

    var heads = [];
    for (var head in projectObj) {
      heads.push(head);
    }
    callback(null, heads);
  });
};

function filePath(projectName) {
  return __dirname + '/../data/' + projectName + '.json';
}

function prefixFile(file){
  return __dirname + '/../data/' + file;
};

function isExist(path, callback) {
  fs.exists(path, function(exists) {
    callback(exists);
  });
}