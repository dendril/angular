'use strict';

var m = angular.module('exampleApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'server'
  ]);

m.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'userCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // $locationProvider.html5Mode(false);
  });

m.run(function($rootScope) {
    console.log( $rootScope.appStarted = new Date() );
  })

// angular.module('server', []);
