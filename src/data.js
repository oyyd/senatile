//data handle
var fs = require('fs'),
  async = require('async');

var data = module.exports = exports = {};

data.getProject = function(projectName, callback) {
  var path = filePath(projectName);

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

data._getFile = function(path, callback) {
  fs.readFile(path, {
    encoding: 'utf8'
  }, function(err, data) {
    if (err) {
      //TODO: handle err better
      callback(err);
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

data.setProject = function(projectName, tasksResult, callback) {
  async.waterfall([function(callback) {
    // get project info
    data.getProject(projectName, function(err, projectObj) {
      callback(err, projectObj);
    });
  }, function(projectObj, callback) {
    // TODO: how to define version?
    var version = new Date();

    var result = projectObj[version.toString()] = {};

    // compose new object 
    for (var taskName in tasksResult) {
      result[taskName] = tasksResult[taskName];
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

function filePath(projectName) {
  return '../data/' + projectName + '.json';
}

function isExist(path, callback) {
  fs.exists(path, function(exists) {
    callback(exists);
  });
}