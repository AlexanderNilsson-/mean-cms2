'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ["ngResource"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $routeProvider
      
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
      })

      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })


      .when('/posts/:id', {
        templateUrl: '/index.html',
        controller: 'AdminController'
      })

      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      });
        
      $routeProvider.otherwise({redirectTo: '/'});
  
}]);