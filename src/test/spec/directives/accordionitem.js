'use strict';

xdescribe('Directive: accordionItem', function () {

  // load the directive's module
  beforeEach(module('exampleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<accordion-item></accordion-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the accordionItem directive');
  }));
});
