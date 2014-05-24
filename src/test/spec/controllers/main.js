'use strict';

describe('Controller: userCtrl', function() {
  var $log;
  var $http;
  var $httpBackend;
  var userCtrl;
  var $scope;
  var URL;

  // Load the controller's module
  beforeEach(module('exampleApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$log_, _$http_, _$httpBackend_, _USER_URL_) {
    URL = _USER_URL_;
    $log = _$log_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();

    // This code run and augment $scope with new methods.
    // As parameter we are providing all the dependencies required by the controller.
    userCtrl = $controller('userCtrl', {
      $scope: $scope,
      $http: $http,
      $log: $log,
      'USER_URL': URL
    });
  }));

  it('should load user information', function() {
    // Hook the request before call it
    $httpBackend
      .whenGET(URL)
      .respond({
        name: 'TEST'
      });

    // Make the request
    $scope.getUser();

    // Simulate response
    $httpBackend.flush();

    // Check method response before
    expect($scope.user).toEqual({
      name: 'TEST'
    });
  });

  afterEach(function() {
    // At the end we need to verify that all the response where consumed by the
    // requests made before.
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
