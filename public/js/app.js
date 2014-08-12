'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ["ngResource", "ngRoute", "ui.router"])
  .run(function ($rootScope, AUTH_EVENTS, AuthService, Session, $location) {
    //when a user requests a new url, check if they are allowed
    //to go there. For example: any url containing substr "admin"
    $rootScope.$on('$locationChangeStart', function (event, next) {
      //if you want to prevent more pages from being accessed,
      //this is where you do it. 
      //if (next.indexOf("urlToRestrict"))...
      if (next.indexOf("admin") > -1) {
        var authorizedRoles = AuthService.authorizedRoles;

        if (!AuthService.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          if (AuthService.isAuthenticated()) {
            // user is not allowed
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          } else {
            // user is not logged in
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          }
          location.href = "/";
        }
      }
    });
  })
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $routeProvider
      
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })

      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })

      .when('/admin/create', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })

      .when('/admin/edit', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })

      .when('/admin/edit/:id', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })

      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AdminController'
      })

      .when('/posts/:id', {
        templateUrl: '/index.html',
        controller: 'AdminController'
      })

      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      });
        
      $routeProvider.otherwise({redirectTo: '/'});
  }])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});