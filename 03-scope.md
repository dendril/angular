# Scope object


## Intro

Basically in all MV* applications you have a *M layer* where the data is handled and prepared to be exposed to the *V layer* or to the *C layer*.

In Angular, we have a service layer to handle data transfers between server and client, and eventually we could have a different offline storage, here is where scopes add value.


    +-------+     +--------+     +------+
    | $http |---->| $scope |<--->| view |
    +-------+  ^  +--------+  ^  +------+
               |              |
             {...}         optional
                           two way
                           binding


You could consider `$scope` as the exposer of the domain model to a view (or any other component in your code).


## Data Modeling

Angular provides by default a [$rootScope](https://code.angularjs.org/1.2.16/docs/api/ng/service/$rootScope) as starting point for modeling. The main idea behind this is to create a tree of "how the information is related".

     +------------+
     | $rootScope |
     +-+----------+
       |
       |   +-------------+
       +---+ childScope1 |
       |   +-------------+
       |
       |   +-------------+
       +---+ childScope2 |
           +-------------+

This structure is combined with an powerful API which allow us `$watch` attributes mutations, `$apply` changes and notify them plus an event system.


## Hierarchy and inheritance

Scopes behave like native javascript objects with extra magic:

1. You could choose use prototype inheritance or not at creation time:

    ```
    // child with prototype inheritance
    $rootScope.$new()
    ```

    or

    ```
    // isolated child (liked to the parent via .$parent reference)
    $rootScope.$new(true)
    ```

2. `$scope` chain works almost the same as prototype chain, with the following difference: **if we assign a property to a ChildScope that property will be defined instead of redefined with the new value.**

    > **IS NOT SAFE** the use of `this` in `$scope` functions, we could have property names collisions between child and parent.

3. We could use `expressions` via `$watch` which will be re-evaluated for each *digest cycle*.

4. We could use for example `ng-model="$parent.name"` to redefine a parent property but it's a very fragile solution. Use an object instead.

    ```js
    scope.name = 'John';
    scope.lastname = 'Grecy';
    ```

    **VS**

    ```js
    scope.data.name = 'John';
    scope.data.lastname = 'Grecy';
    ```


## Event system

The scope tree is a base for notify different events between parts of your app, but keep in mind that events bubbles across all the tree and you don't have full control over propagation to handle performance problems.

1. `$scope.$broadcast` go down into the scope tree from a given node.
2. `$scope.$emit` go up into the scope tree from a given node.
3. `$scope.$on` scope event listener.
4. use `$scope.$broadcast` and `$scope.$emit` with responsability.
5. to handle propagation, please see the test switch about the event system.


## Integration with the browser event loop (digest cycle)



## References

- https://github.com/angular/angular.js/wiki/Understanding-Scopes#JSproto
- https://code.angularjs.org/1.2.16/docs/guide/scope
- http://www.bennadel.com/blog/2635-looking-at-how-scope-evalasync-affects-performance-in-angularjs-directives.htm
