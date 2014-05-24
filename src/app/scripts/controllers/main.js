'use strict';

angular.module('exampleApp')
  .controller('userCtrl', function($scope, $http, $log, USER_URL) {

    console.log('user controller');

    // Allow the scope to make a request to the server and updates the user data
    // with the service response.
    $scope.getUser = function getUser() {
      $http.get(USER_URL).then(function(response) {
        $scope.user = response.data;
      }, function(reason) {
        $log.warn(reason);
      });
    };

  });
