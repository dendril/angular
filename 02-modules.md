# Modules and Dependency Injection

A module acts as a container for other AngularJS managed objects (controllers, services, and so on).

For example, we could define a `application` module, with some dependencies and attach a controller:

```js
angular.module('application', ['dependency1', 'dependency2', 'dependency3'])  
  .controller('HelloCtrl', function HelloCtrl() {
    console.log('My first controller');
  });
```

## Dependency Injection

AngularJS is only capable of wiring up objects it is aware of. As a consequence, the very first step for plugging into DI machinery is to register an object with an AngularJS module. ***We are not registering the object's instance directly, rather we are throwing object-creation recipes into the AngularJS dependency injection system.***

There are 2 main objects which handle all the show `$provider` and `$injector`. The `$provide` service has a number of methods for registering components with the $injector. `$injector` is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.

The `$provider` provides the following registration mechanism:

1. `.constant(name, value)`
2. `.value(name, value)`
3. `.service(name, recipe)`
4. `.factory(name, recipe)`
5. `.provider(name, recipe)`

### Constant

The idea of this is usually you have some **constants** across all your application and the property you are looking for is "this value do not change at runtime".

```js
module.constant('MAX_VALUE', 64);
```

### Value

When you have named-objects in your application, it's just simple to register your plain object using this method.

```js
module.value('strfmt', {
  fmt: function (format, input) { ... }
})
```

### Service

When you have a recipe for create an object (a constructor) you must register it with a name. The easiest way is use a service with plain javascript constructor name.

```js
function Dog() {}

Dog.prototype = {
  walk: function () { ... }
};

module.service('Dog', Dog);
```

>
> NOTE: Each time you request this service you will get the same instance, it works as a singleton.
>

### Factory

Sometimes you will need more support from the DI system, for example allocate some private variables before create an instance, or any pre-processing you require before be able to create an object.

```js
module.factory('Dog', function() {
  function Dog() {}

  Dog.prototype = {
    walk: function () { ... }
  };

  return new Dog();
});
```

Internally this is a short hand for `$provide.provider(name, {$get: $getFn})`.

### Provider

Finally Angular provides another abtraction level over **factory**. It is as simple as follow:

```js
module.provider('Dog', function() {
  
  // Put here any custom configuration or initialization.

  return {
    $get: function () {
      function Dog() {}

      Dog.prototype = {
        walk: function () { ... }
      };

      return new Dog();
    }
  };

});
```

## Modules lifecycle

Two phases:

1. **The configuration phase:** It is the phase where all the recipes are collected and configured.

2. **The run phase:** It is the phase where we can execute any post-instantiation logic.

As an example of config phase:

```js
myMod.config(function(notificationsServiceProvider)) {
    notificationsServiceProvider.setMaxLen(5);
});
```

## Modules and services visibility

A service defined in one of the application's modules is visible to all the other modules. In other words, hierarchy of modules doesn't influence services' visibility to other modules. When AngularJS bootstraps an application, it combines all the services defined across all the modules into one application, that is, global namespace.

1. Services override are allowed.
2. This requires an extra effort to prevent colletions and keep them manageable (conventions!!).
3. If you use something from a module, do not forget to include it as part the modules hierarchy.

## How $injector handle dependencies

Up to now we where assuming magic by `$injector` when processing recipes hooked as services.

```js
// inferred (only works if code not minified/obfuscated)
$injector.invoke(function(serviceA){});

// annotated
function explicit(serviceA) {};
explicit.$inject = ['serviceA'];
$injector.invoke(explicit);

// inline
$injector.invoke(['serviceA', function(serviceA){}]);
```

You will find the 3 ways of express dependencies, they are all the same, so you could choose your prefered style.

