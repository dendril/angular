'use strict';

function FilteredNotify() {
  Notify.apply(this, arguments);

  this.filter = false;
}

FilteredNotify.prototype = new Notify();
FilteredNotify.prototype.constructor = FilteredNotify;

FilteredNotify.prototype.setFilter = function(f) {
  if (f instanceof Function) this.filter = f;
  else throw new Error('Not callable filter provided');
};

FilteredNotify.prototype.getAll = function() {
  var getter = Notify.prototype.getAll;
  var arr = getter.call(this);

  if (this.filter)
    return arr.filter(this.filter);

  return arr;
};


// Reuse notify module
angular.module('notify')
        // Add filtered notify definition
        .factory('filteredNotify', function() {
          return new FilteredNotify();
        });
