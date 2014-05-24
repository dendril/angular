'use strict';

describe('Directive: bsPrimaryButton', function () {

  // load the directive's module
  beforeEach(module('exampleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should add the correct CSS classes and keep any existent one', inject(function ($compile) {
    element = angular.element(
      '<bs-primary-button class="test-btn" type=submit></bs-primary-button>'
    );

    element = $compile(element)(scope);

    expect(element.hasClass('btn btn-primary')).toBe(true);
    expect(element.hasClass('test-btn')).toBe(true);
  }));

});
