'use strict';

app.factory("mongoService", function($resource, $http) {
  //mongoService has been divided into parts so that we can
  //request more that just posts.
  //to use mongoService, see the HomeController and/or AuthService.login
  var mongoServant = {};

  mongoServant.posts = function() {
    var resource = $resource("/api/posts/:id", { id: "@_id" },
      {
        'create':  { method: 'POST' },
        'index':   { method: 'GET', isArray: true },
        'show':    { method: 'GET', isArray: false },
        'update':  { method: 'PUT' },
        'destroy': { method: 'DELETE' }
      }
    );
    return resource;
  };
  mongoServant.users = function() {
    var resource = $resource("/api/users/:username.:password", { username: "@username"},
      {
        'create':  { method: 'POST' },
        'index':   { method: 'GET', isArray: true },
        'show':    { method: 'GET', isArray: false },
        'update':  { method: 'PUT' },
        'destroy': { method: 'DELETE' }
      }
    );
    return resource;
  };
  
  mongoServant.register = function() {
    var resource = $resource("/api/users/", { },
      {
        'create':  { method: 'POST' }
      }
    );
    return resource;
  };

  return mongoServant;
})



.factory('AuthService', function (Session, USER_ROLES, mongoService, $rootScope, AUTH_EVENTS, $location) {
  var AuthServant = {};
  //login function
  AuthServant.login = function (credentials) {
    var usersResource = mongoService.users();
    var queryResult = usersResource.show(credentials, function(res) {
      //create a new session
      var success = Session.create(res);
      var authorizedRoles = AuthServant.authorizedRoles;

      if (success && (authorizedRoles.indexOf(success.role) >= 0)) {
        //broadcast your success to the world!
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

        return success;
      } else {
        //broadcast your failure to the world!
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        
        return false;
      }
    }, function(err) {
      //broadcast your failure
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      return false;
    });

    return queryResult;
  };

  // Create a new user
  AuthServant.create = function (credentials) {
    var usersResource = mongoService.register();
    usersResource.create(credentials, function(res) {
      console.log("Created account", credentials);
    });
  };

  AuthServant.isAuthenticated = function () {
    //i have no idea what this does
    return !!Session.userId;
  };
  AuthServant.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    return (AuthServant.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  //we should probably update these
  AuthServant.authorizedRoles = [USER_ROLES.admin, USER_ROLES.editor];

  return AuthServant;
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  //i have absolutely no idea what this does, maybe remove?
  return {
    responseError: function (response) {
      if (response.status === 401) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,
                              response);
      }
      if (response.status === 403) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,
                              response);
      }
      if (response.status === 419 || response.status === 440) {
        $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,
                              response);
      }
      return $q.reject(response);
    }
  };
})
.service('Session', function () {
  this.create = function (userData) {
    //create a session and store some needed info
    var startStamp = Date.now();
    userData.startStamp = startStamp;
    localStorage.setItem("Session", JSON.stringify(userData));
    var sessionData = this.getSession();
    this.id = sessionData["userid"]
    this._id = sessionData["_id"];
    this.userRole = sessionData["role"];

    return sessionData;
  };
  this.destroy = function () {
    //destroy a session and remove info
    localStorage.removeItem("Session");
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  this.getSession = function() {
    //simple function for getting all session data if needed
    var sessionData = JSON.parse(localStorage.getItem("Session"));

    if (!sessionData || !sessionData.role) {
      //if no data, return false
      sessionData = {};
      sessionData["id"] = false;
      sessionData["_id"] = false;
      sessionData["userRole"] = false;

      return false;
    }
    //else set variables again and move on!
    this.id = sessionData["userid"]
    this.userId = sessionData["_id"];
    this.userRole = sessionData["role"];

    return sessionData;
  }

  //get session data already now just to be sure (overkill?)
  this.getSession();
  return this;
});