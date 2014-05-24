'use strict';

describe('Model: FilteredNotify', function () {
  var notify;

  // Load the module we want to test (service name actually).
  beforeEach(module('notify'));

  // Inject any dependency into the test env.
  beforeEach(inject(function (_filteredNotify_) {
    notify = _filteredNotify_;
  }));

  it('should keep messages starting with "a"', function () {
    notify.setFilter(function (message) {
      return String(message).startsWith('a');
    });

    notify.archive('message');
    notify.archive('a message');
    notify.archive('another message');

    expect(notify.getAll()).toEqual(['a message', 'another message']);
  });
});
