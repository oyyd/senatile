(function() {
  'use strict';

  angular.module('testModule', ['ngMaterial'])
    .controller('testController', ['$scope', function($s) {
      $s.isValid = true;
    }]);
})();