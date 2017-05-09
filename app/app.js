'use strict';

var Utils = Utils || {};

Utils.helpers = {
    watchVariable: function(obj, prop, handler) {
        var currval = obj[prop];
        function callback() {
            if (obj[prop] != currval) {
                var temp = currval;
                currval = obj[prop];
                handler(temp, currval);
            }
        }
        return callback;
    },
    isNotString: function(str) {
        return (typeof str !== "string");
    }
};

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'iris',
  'core'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

}])

