'use strict';

describe('Directive: myHelloWorld', function () {

  // load the directive's module
  beforeEach(module('exampleApp'));

  var linkingFn,
    element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    linkingFn = $compile('<my-hello-world></my-hello-world>');
    element = linkingFn(scope);
  }));

  it('should create my-hello-world directive', function() {
    expect(element.text()).toBe('this is the myHelloWorld directive');
  });
});
