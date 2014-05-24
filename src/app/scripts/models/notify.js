'use strict';

function Notify() {
  this.id = ++Notify.id;
  this.storage = [];
}

Notify.id = 0;

Notify.prototype.archive = function (message) {
  this.storage.push(message);
};

Notify.prototype.getAll = function () {
  return this.storage;
};


// notify module definition! be careful!
angular.module('notify', [])
        // registered service notify with the Notify constructor
        .service('notify', Notify);
