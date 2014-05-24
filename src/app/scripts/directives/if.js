'use strict';

angular.module('exampleApp')
  .directive('if', function () {
    return {
      transclude: 'element',
      compile: function (element, attr, transclude) {

        return function postLink(scope, element, attr) {
          var childElement, childScope;

          // watch for the string defined in the template using the attribute
          // if="someVar"
          scope.$watch(attr['if'], function (newValue) {
            // cache the result in a local variable to be able to
            // remove the content after a value change
            if (childElement) {
              childElement.remove();
              childScope.$destroy();
              childElement = undefined;
              childScope = undefined;
            }

            // if the attribute is true, then create the content of the
            // directive using the transclude function and update the cache
            if (newValue) {
              childScope = scope.$new();
              childElement = transclude(childScope, function(clone){
               element.after(clone);
              });
            }
          });
        };

      }
    };
  });
