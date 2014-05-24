'use strict';

var fn = function AccordionDirectiveController($scope, $attrs) {
  /**
  Collection of scope with {
    isOpen: Boolean
  }
  **/
  this.groups = [];

  /**
  Mark as closed all the others scopes.
  **/
  this.closeOthers = function(scope) {
    angular.forEach(this.groups, function(group) {
      if (group !== scope) {
        group.isOpen = false;
      }
    });
  };

  /**
  Add a child scope to the group of scopes.
  **/
  this.addGroup = function(scope) {
    this.groups.push(scope);

    // When the child item is destroyed, we need to unreference the scope to
    // prevent any memory leak.
    scope.$on('$destroy', function() {
      this.removeGroup(scope);
    }.bind(this));
  };

  /**
  Remove a child scope from the group of scopes.
  **/
  this.removeGroup = function(scope) {
    var index = this.groups.indexOf(scope);
    if (index !== -1) {
      this.groups.splice(this.groups.indexOf(scope), 1);
    }
  };

};
fn.$inject = ['$scope', '$attrs'];

angular.module('exampleApp').controller(fn.name, fn);
