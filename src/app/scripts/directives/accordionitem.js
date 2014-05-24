'use strict';

angular.module('exampleApp')
  .directive('accordionItem', function() {
    return {
      require: '^accordion',
      transclude: true,
      replace: true,
      template: '<div class="accordion-group">' +
                  '<div class="accordion-heading">' +
                    '<a class="accordion-toggle" ng-click="isOpen=!isOpen">{{heading}}</a>' +
                  '</div>' +
                  '<div class="accordion-body" ng-show="isOpen">' +
                    '<div class="accordion-inner" ng-transclude></div>' +
                  '</div>' +
                '</div>',
      scope: {
        heading: '@'
      },
      link: function(scope, element, attrs, accordionCtrl) {
        accordionCtrl.addGroup(scope);
        scope.isOpen = false;

        scope.$watch('isOpen', function(value) {
          value && accordionCtrl.closeOthers(scope);
        });
      }
    };
  });
