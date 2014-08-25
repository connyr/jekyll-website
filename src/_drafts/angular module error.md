Uncaught Error: [$injector:nomod] Module 'e2eControllers' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.
http://errors.angularjs.org/1.2.21/$injector/nomod?p0=e2eControllers 

///--------------------------

Creation versus Retrieval
Beware that using angular.module('myModule', []) will create the module myModule and overwrite any existing module named myModule. Use angular.module('myModule') to retrieve an existing module.

var myModule = angular.module('myModule', []);

// add some directives and services
myModule.service('myService', ...);
myModule.directive('myDirective', ...);

// overwrites both myService and myDirective by creating a new module
var myModule = angular.module('myModule', []);

// throws an error because myOtherModule has yet to be defined
var myModule = angular.module('myOtherModule');

////---------------------
https://docs.angularjs.org/guide/module