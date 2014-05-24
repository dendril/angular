'use strict';

describe('Model: Notify', function () {
  var notify;

  // Load the module we want to test (service name actually).
  beforeEach(module('notify'));

  // Inject anything you want using _NAME_
  beforeEach(inject(function (_notify_) {
    notify = _notify_;
  }));

  it('should have none messages by default', function () {
    expect(notify.getAll()).toEqual([]);
  });

  it('should have one message after call archive', function () {
    var message = 'hello world';

    notify.archive(message);
    expect(notify.getAll()).toEqual([message]);
  });

  it('should have an id property', function () {
    expect(notify.id).toBe(Number(notify.id));
  });
});
