'use strict';

/**
Filter proposal.
**/
up.$inject = ['$locale'];
function up($locale) {
  // Private variables (unused in this case).
  var formats = $locale.NUMBER_FORMATS;

  // Public API
  return function(input){
    return String(input).toUpperCase();
  };
}

angular.module('textFilters', [])
        // register our custom filter
        .filter('up', up);