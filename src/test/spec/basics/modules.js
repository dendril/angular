'use strict';

describe('Basics: Modules and DI', function() {
  var myModule;

  beforeEach(inject(function($rootScope) {
    myModule = angular.module('myModule', []);
  }));

  it('constant', function() {
    myModule.constant('MAX_VALUE', 10)
      .constant('MAX_VALUE', 101);

    expect(angular.injector(['myModule']).get('MAX_VALUE')).toBe(10);
  });

  it('named-value objects', function() {
    myModule
      .value('helpers', {
        a: 10
      })
      .value('helpers', {
        a: 20
      });

    var $inj = angular.injector(['myModule']);

    expect($inj.get('helpers').a).toBe(20);
  });

  it('provides a service method to register constructor functions', function() {
    myModule.service('myService', function MyService() {
      this.property = 0;
    });

    var $inj = angular.injector(['myModule']);
    var a = $inj.get('myService');
    var b = $inj.get('myService');

    expect(a).toEqual(b);

    a.property = 1;

    expect(b.property).toEqual(1);
  });

  it('provides a service method to register constructor and could work as a factory', function() {
    myModule.service('myService', function MyService() {
      function Type() {
        this.prop = 0;
      }

      return new Type();
    });

    var $inj = angular.injector(['myModule']);
    var a = $inj.get('myService');
    var b = $inj.get('myService');

    expect(a).toEqual(b);

    a.prop = 1;

    expect(b.prop).toEqual(1);
  });

  it('provides a factory method which wrap the service by a function', function() {
    var contextCounter = 0,
      factoryCounter = 0;

    myModule.factory('myFactory', function myFactory() {
      contextCounter++;

      return function myFactoryReturn() {
        factoryCounter++;

        return true;
      };
    });

    var $inj = angular.injector(['myModule']);
    var a = $inj.get('myFactory');
    var b = $inj.get('myFactory');

    expect(contextCounter).toBe(1);
    expect(factoryCounter).toBe(0);

    a();

    expect(factoryCounter).toBe(1);
  });

  it('should define a provider which is basically another abstraction level over factories', function() {
    var providerCounter = 0,
      factoryCounter = 0,
      serviceCounter = 0;

    myModule.provider('myProvider', function provider() {
      providerCounter++;

      return {
        $get: function factory() {
          factoryCounter++;

          return function service() {
            serviceCounter++;

            return 'yay, another stuff';
          };
        }
      };
    });

    expect(providerCounter).toBe(0);

    var service = angular.injector(['myModule']).get('myProvider');

    expect(providerCounter).toBe(1);
    expect(factoryCounter).toBe(1);

    expect(service()).toBe('yay, another stuff');
    expect(serviceCounter).toBe(1);
  });

  it('overrides services without any limitation across modules', function() {

    // angular.module('app', ['engines', 'cars'])
    // angular.module('app', ['engines', 'cars', 'collision'])
    // angular.module('app', ['engines', 'collision', 'cars'])
    // angular.module('app', ['engines', 'cars', 'collision2'])
    // angular.module('app', ['engines', 'cars', 'collision', 'collision2'])
    // angular.module('app', ['collision2', 'engines', 'cars', 'collision'])
    angular.module('app', ['engines', 'cars', 'collision3'])
      .factory('api', function(car) {
        console.log('api');

        return {
          make: function make() {
            return car.create();
          }
        };
      });

    angular.module('cars', [])
      .factory('car', function(engine) {
        console.log('car');

        return {
          create: function() {
            return engine;
          }
        };
      });

    angular.module('engines', ['collision'])
      .factory('engine', function diesel() {
        console.log('diesel');

        return {
          type: 'diesel'
        };
      });

    angular.module('collision', [])
      .factory('engine', function nafta() {
        console.log('nafta');

        return {
          type: 'nafta'
        };
      });

    angular.module('collision2', [])
      .factory('engine', function solar() {
        console.log('solar');

        return {
          type: 'solar'
        };
      });

    angular.module('collision3', [])
      .factory('engine', function solar() {
        console.log('nuclear');

        return {
          type: 'nuclear'
        };
      });

    // Load all the modules hierarchy from app.
    var $inj = angular.injector(['app']);

    expect($inj.get('api').make()).toEqual({
      type: 'nuclear' // change it to 'nafta' and figure out the changes required to make it work
    });

    expect($inj.get('engine')).toEqual({
      type: 'nuclear' // change it to 'nafta' and figure out the changes required to make it work
    });

  });

  describe('Patterns', function() {
    it('Decorator', function() {
      function HelloWorld() {
        this.prop = 1234;
      };

      HelloWorld.prototype.message = function() {
        return 'hello world';
      };

      myModule.service('helloWorld', HelloWorld);

      myModule.config(function($provide) {

        $provide.decorator('helloWorld', function($delegate) {

          $delegate.message = function() {
            return this.__proto__.message() + '!!!';
          };

          // Return the decorated version
          return $delegate;
        });

      });

      var service = angular.injector(['myModule']).get('helloWorld');

      expect(service.prop).toBe(1234);
      expect(service.message()).toBe('hello world!!!');
    });
  });
});
