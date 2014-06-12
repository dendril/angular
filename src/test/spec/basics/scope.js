'use strict';

/**
Ref Scope:   https://code.angularjs.org/1.2.16/docs/guide/scope
Ref Spies:   https://github.com/pivotal/jasmine/wiki/Spies
Ref Jasmine: http://jasmine.github.io/2.0/introduction.html
**/
describe('Basics: Scope', function () {
  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should access parent values via prototype (not isolated version)', inject(function () {
    var parent = scope;
    var child = parent.$new();

    parent.a = 10;
    expect(child.a).toBe(10);
  }));

  it('should not have access to parent values via prototype when use isolate', inject(function () {
    var parent = scope;
    var child = parent.$new(true);

    parent.a = 10;
    expect(child.a).toBeUndefined();
  }));

  it('should shadow properties if I define a property in the child', inject(function () {
    var parent = scope;
    var child = parent.$new();

    parent.a = 10;
    child.a = 20;

    expect(parent.a).toBe(10);
    expect(child.a).toBe(20);
  }));

  it('should allow watch attributes in the scope chain', inject(function () {
    //
    // Scope chain
    // parent <=> child
    //

    var parent = scope;
    var child = parent.$new();
    var cb = jasmine.createSpy();

    parent.a = 10;

    child.$watch('a', cb);

    parent.a = 11;

    child.$digest();

    parent.a = 12;

    // Doesn't matter if I use parent or child in this call.
    child.$digest();

    expect(cb).toHaveBeenCalledWith(11, 11, child);
    expect(cb).toHaveBeenCalledWith(12, 11, child);
    expect(cb.calls.count()).toBe(2);
  }));

  it('should notify changes ONLY from the disgested scope to all the descendants', inject(function () {
    //
    // Scope chain
    // l0 <=> l1 <=> l2
    //
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();

    var l0Cb = jasmine.createSpy();
    var l1Cb = jasmine.createSpy();
    var l2Cb = jasmine.createSpy();

    l0.a = 0;
    l1.$watch('a', l1Cb);
    l2.$watch('a+1', l2Cb);

    l0.a = 1;
    l2.$digest();

    expect(l1.a).toBe(1);
    expect(l1Cb).not.toHaveBeenCalled();

    expect(l2Cb).toHaveBeenCalledWith(2, 2, l2);
    expect(l2Cb.calls.count()).toBe(1);
  }));

  it('should call $watch expressions in the scope chain from the root when used $apply', inject(function () {
    //
    // Scope chain
    // l0 <=> l1 <=> l2
    //
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();

    var l0Cb = jasmine.createSpy();
    var l1Cb = jasmine.createSpy();
    var l2Cb = jasmine.createSpy();

    l0.a = 0;
    l1.$watch('a', l1Cb);
    l2.$watch('a+1', l2Cb);

    l2.$apply('a=1');

    expect(l1.a).toBe(0);                        // this value is the same as l0.a
    expect(l1Cb).toHaveBeenCalledWith(0, 0, l1); // there is none change here because the value is created at l2 scope object.
    expect(l1Cb.calls.count()).toBe(1);          // it's called once

    expect(l2Cb).toHaveBeenCalledWith(2, 2, l2);
    expect(l2Cb.calls.count()).toBe(1);

    expect(l0.a).toEqual(0);
    expect(l1.a).toEqual(0);
    expect(l2.a).toEqual(1);
  }));

  it('should call function expressions in $watch after $digest call', inject(function () {
    var l0 = scope;
    var l1 = l0.$new();
    var cb = jasmine.createSpy('hello');

    l0.hello = function hello() {
        return 'hey';
    };

    l1.$watch('hello()', cb);

    l0.$digest(); // doesn't matter if I have changed something or not, this is handled

    expect(cb).toHaveBeenCalledWith('hey', 'hey', l1);
  }));

  it('should detach part of the chain after call $destroy', inject(function () {
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();
    var cb = jasmine.createSpy('do not call twice');

    l0.$watch('x', cb);
    l2.$watch('x', cb);

    l1.$destroy();

    l2.$apply('x=1'); // this works as expected because apply calls $root

    expect(cb).toHaveBeenCalledWith(void 0, void 0, l0);
    expect(cb).not.toHaveBeenCalledWith(1, 1, l2);
    expect(cb.calls.count()).toBe(1);
  }));

  it('should watch changes on a collection', inject(function () {
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();
    var cb = jasmine.createSpy('listener');

    var arr = ['a', 2, function() {}];
    var dic = {
        a: 10,
        b: 'hello',
        c: {
            a: 10
        },
        d: [1, 2, 3]
    };

    l0.arr = angular.copy(arr);
    l0.dic = angular.copy(dic);

    l0.$watchCollection('arr', cb);

    l0.arr[0] = 1;

    expect(cb.calls.count()).toEqual(0);

    l0.$digest();

    expect(cb.calls.count()).toEqual(1);
    expect(cb.calls.argsFor(0)[0]).toContain(1);

    l0.arr.push(10);
    l0.$digest();

    expect(cb.calls.count()).toEqual(2);
    expect(cb.calls.argsFor(1)[0]).toContain(10);

    l0.$watchCollection('dic', cb);

    l0.dic.a = 'another value type';
    l0.dic.c.a = 'another change in depth';
    l0.dic.d[1] = 101;
    l0.$digest();

    expect(cb.calls.count()).toEqual(3);
    expect(cb.calls.argsFor(2)[0].a).toEqual('another value type');
    expect(cb.calls.argsFor(2)[0].c.a).toEqual('another change in depth');
    expect(cb.calls.argsFor(2)[0].d[1]).toEqual(101);
    expect(cb.calls.argsFor(2)[0].b).toEqual('hello');

    l0.$digest();

    expect(cb.calls.count()).toEqual(3);

    l0.arr[0] = 10101;
    l0.$digest();

    expect(cb.calls.count()).toEqual(4);
    expect(cb.calls.argsFor(3)[0]).toContain(10101);
  }));

  it('provides an basic event system ($broadcast, $emit, $on)', inject(function () {
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();
    var cb = jasmine.createSpy('listener');

    l0.$on('evt', cb);
    l1.$on('evt', cb);
    l2.$on('evt', cb);

    l0.$broadcast('evt');

    expect(cb.calls.count()).toBe(3);

    l1.$emit('evt');

    expect(cb.calls.count()).toBe(5);
  }));

  it('provides an basic event system (preventDefault, stopPropagation)', inject(function () {
    var l0 = scope;
    var l1 = l0.$new();
    var l2 = l1.$new();
    var cb = jasmine.createSpy('listener');

    var preventDefault = function(evt) {
      // sets the flag of defaultPrevented to true
      evt.preventDefault();
    };

    var stopPropagation = function(evt) {
      // Broadcasted events does not provides this method (not cancelable)
      evt.stopPropagation && evt.stopPropagation();
    };

    l0.$on('evt', cb);
    // l1.$on('evt', cb); // stopPropagation does affect the current node listeners
    l1.$on('evt', stopPropagation);
    l1.$on('evt', preventDefault);
    l1.$on('evt', cb);
    l2.$on('evt', cb);

    l0.$broadcast('evt');

    // there is no way to prevent calling when using $broadcast
    expect(cb.calls.count()).toBe(3);

    // looks like evt object is the same for all the chain! (true are for ALL the cb calls)
    expect(_(cb.calls.allArgs()).flatten().pluck('defaultPrevented').value()).toEqual([true, true, true]);

    l2.$emit('evt');

    // stopPropagation take place here and the cb hooked at l0 is never called
    expect(cb.calls.count()).toBe(3 + 2 /* just 2 jumps! */);
  }));
});
