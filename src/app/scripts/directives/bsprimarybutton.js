'use strict';

angular.module('exampleApp')
  .directive('bsPrimaryButton', function () {
    return {
      restrict: 'E',
      compile: function(element, attributes, transclude) {
        element.addClass('btn btn-primary');
      }
    };
  });
