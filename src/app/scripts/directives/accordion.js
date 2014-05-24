'use strict';

angular.module('exampleApp')
  .directive('accordion', function () {
    return {
      controller: 'AccordionDirectiveController',
      link: function postLink(scope, element, attrs) {
        element.addClass('accordion');
      }
    };
  });
