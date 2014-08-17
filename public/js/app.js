'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ["ngResource", "ngRoute", "ui.router"])
  .run(function ($rootScope, AUTH_EVENTS, USER_ROLES, AuthService, Session, $location) {
    //when a user requests a new url, check if they are allowed
    //to go there. For example: any url containing substr "admin"
    var currentUser = Session.getSession();
    console.log("currentUser: ", currentUser);
    $rootScope.$on('$locationChangeStart', function (event, next) {
      AuthService.adminExists();
      var adminExists = AuthService.foundAdmin;
      //if you want to prevent more pages from being accessed,
      //this is where you do it. 
      //if (next.indexOf("urlToRestrict"))..
      if (next.indexOf("admin") > -1 && adminExists) {
        var authorizedRoles = AuthService.authorizedRoles;

        if (next.indexOf("admin/users") > -1 && AuthService.isAuthorized() && currentUser.role != USER_ROLES.admin) {
          event.preventDefault();
          location.href = "/admin";
        }

        if (!AuthService.isAuthorized()) {
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
      } else if (!adminExists) {
        if ((next.indexOf("admin") > -1 && next.indexOf("admin/users/create") < 0) || next.indexOf("admin/users/create") < 0) {
          var authorizedRoles = AuthService.authorizedRoles;
          event.preventDefault();
          if (!AuthService.isAuthorized()) {
            if (AuthService.isAuthenticated()) {
              // user is not allowed
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
              // user is not logged in
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
            location.href = "/admin/users/create";
          }
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

      .when('/view/:id', {
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

      .when('/admin/edit/:id', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController'
      })

      .when('/admin/users', {
        templateUrl: 'views/users.html',
        controller: 'LoginController'
      })

      .when('/admin/users/create', {
        templateUrl: 'views/users.html',
        controller: 'LoginController'
      })

      .when('/admin/users/edit/:id', {
        templateUrl: 'views/users.html',
        controller: 'LoginController'
      })

      .when('/admin/users/view/:id', {
        templateUrl: 'views/users.html',
        controller: 'LoginController'
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