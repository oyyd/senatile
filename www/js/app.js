(function() {
  'use strict';
  var module = angular.module('testModule', ['ngMaterial'])
    .config(['$mdThemingProvider', function($themeProvider) {
      $themeProvider.theme('default').primaryPalette('blue');
    }]);

  module.controller('testController', ['$scope', '$http', function($s, $http) {
    $s.isValid = true;
    $s.projects = [];

    // init
    $http.get('/projects').success(function(projects) {
      for (var index in projects) {
        var project = projects[index],
          latest = null,
          latestHead = null;

        for (var head in project) {
          var build = project[head];
          // build.time = build.timestamp;
          // build.dateTime = (new Date(build.timestamp)).toString();

          if (latest == null || build.timestamp < latest) {
            latest = build.timestamp;
            latestHead = head;
          }
        }

        project.latestHead = latestHead;
        project.lastBuildTime = (new Date(project[latestHead].timestamp)).toString();
      }

      $s.projects = projects;
      console.log($s.projects);
    }).error(function() {
      alert('request projects failed!');
    });
  }]);

  module.directive('projectCard', [function() {
    var link = function(s, e, a) {
      var ele = e[0];
      ele.querySelector('.head').textContent = a['name'] || "-";
      ele.querySelector('.buildTime').textContent = a['lastBuildTime'] || "-";
      ele.querySelector('.repoHead').textContent = a['head'] || "-";

      var card = ele.querySelector('.card');
      card.addEventListener("mouseenter", function() {
        card.classList.remove('md-whiteframe-z1');
        card.classList.add('md-whiteframe-z2');
      });

      card.addEventListener("mouseleave", function() {
        card.classList.remove('md-whiteframe-z2');
        card.classList.add('md-whiteframe-z1');
      });

      ele.querySelector('[role="detailLink"]').onclick = function() {
        location.href = a['detailUrl'];
      };
    };

    return {
      link: link,
      templateUrl: '/temp/project/project_card.html'
    };
  }]);

  document.body.style.display = "block";
})();