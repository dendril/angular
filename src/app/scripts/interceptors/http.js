angular.module('httpInterceptors', [])
  .config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('retryInterceptor');
  })
  .factory('retryInterceptor', function($injector, $q) {
    return function(responsePromise) {
      return responsePromise.then(null, function(errResponse) {
        if (errResponse.status === 503) {
          return $injector.get('$http')(errResponse.config);
        } else {
          return $q.reject(errResponse);
        }
      });
    };
  });
