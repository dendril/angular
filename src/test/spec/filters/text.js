'use strict';

describe('Filters: TextFilters', function () {
  var upFilter;

  // Load the module we want to test (service name actually).
  beforeEach(module('textFilters'));

  // Inject anything you want using _NAME_
  beforeEach(inject(function (_upFilter_) {
    upFilter = _upFilter_;
  }));

  it('should convert any parameter to UPPERCASE', function () {
    expect(upFilter('hello')).toEqual('HELLO');
  });
});
