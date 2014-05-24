'use strict';

describe('Directive: if', function () {

  // load the directive's module
  beforeEach(module('exampleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('show or remove an element based on a flag', inject(function($compile) {
    element = $compile('<div><div if="someVar"></div></div>')(scope);

    // Open
    scope.$apply('someVar = true');
    expect(element.children().length).toBe(1);

    // Close
    scope.$apply('someVar = false');
    expect(element.children().length).toBe(0);

    // Open
    scope.$apply('someVar = true');
    expect(element.children().length).toBe(1);
  }));

});
