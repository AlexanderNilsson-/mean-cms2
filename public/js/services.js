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
    var resource = $resource("/api/users/:id", { id: "@_id"},
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

  mongoServant.tags = function() {
    var resource = $resource("/api/tags/:id", { id: "@_id" },
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
        'create':  { method: 'POST' },
        'index':   { method: 'GET', isArray: true }
      }
    );
    return resource;
  };


  mongoServant.titles = function() {
    var resource = $resource("/api/titles/:id", { id: "@_id"},
      {
        'create':  { method: 'POST' },
        'index':   { method: 'GET', isArray: false },
        'update':  { method: 'PUT' }
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
    var allUsers = usersResource.index(function(res) {
      for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].username === credentials.username && allUsers[i].password === credentials.password) {
          usersResource.show({"id": allUsers[i]._id}, function(res) {
            //create a new session
              var success = Session.create(res);
              var authorizedRoles = AuthServant.authorizedRoles;

              if (success) {
                AuthServant.adminExists();
                //broadcast your success to the world!
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              } else {
                //broadcast your failure to the world!
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
              }
          }, function(err) {
            //broadcast your failure
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          });
        }
      }
    });
  };

  AuthServant.logout = function () {
    Session.destroy();
    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
  };

  // Create a new user
  AuthServant.create = function (credentials) {
    var usersResource = mongoService.register();
    usersResource.create(credentials, function(res) {
      console.log("created new user!", credentials);
      if (!Session.getSession()) {
        AuthServant.login(credentials)
      }
    });
  };

  AuthServant.isAuthenticated = function () {
    //i have no idea what this does
    return !!Session._id;
  };

  AuthServant.isAuthorized = function () {
    var currentUser = Session.getSession();
    var authorizedRoles = AuthServant.authorizedRoles;

    return (AuthServant.isAuthenticated() && authorizedRoles.indexOf(currentUser.role) !== -1);
  };

  AuthServant.isAdmin = function () {
    var currentUser = Session.getSession();

    return (AuthServant.isAuthorized() && currentUser.role == USER_ROLES.admin);
  };

  AuthServant.adminExists = function() {
    var adminExists = false;
    var registerResource = mongoService.register();
    var foundAdmin = jQuery.ajax({
      url: "/api/users/",
      data: {},
      dataType: "json",
      async: false,
      success: function(data) {
        for(var i = 0; i < data.length; i++) {
          for(var j in data[i]) {
            if (j == "adminExists") {
              adminExists = data[i][j];
            }
          }
        }
        return adminExists;
      }
    });

    AuthServant.foundAdmin = adminExists;

    return adminExists;
  };

  //we should probably update these
  AuthServant.authorizedRoles = [USER_ROLES.admin, USER_ROLES.editor];

  AuthServant.adminExists();

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
  var me = this;
  this.create = function (userData) {
    //create a session and store some needed info
    var startStamp = Date.now();
    userData.startStamp = startStamp;

    localStorage.setItem("Session", JSON.stringify(userData));
    var sessionData = me.getSession();

    me._id = sessionData._id;
    me.userRole = sessionData.role;

    return sessionData;
  };

  this.updateSession = function(userData) {
    var currentSessionData = me.getSession();
    currentSessionData.username = userData.username;
    currentSessionData.role = userData.role;
    currentSessionData._id = userData._id;
    localStorage.setItem("Session", JSON.stringify(currentSessionData));
    
    me.getSession();
  }

  this.destroy = function () {
    //destroy a session and remove info
    localStorage.removeItem("Session");
    me._id = null;
    me.role = null;
  };

  this.getSession = function() {
    //simple function for getting all session data if needed
    var sessionData = JSON.parse(localStorage.getItem("Session"));

    if (!sessionData || !sessionData.role) {
      //if no data, return false
      sessionData = {};
      sessionData._id = false;
      sessionData.role = false;

      return false;
    }
    //else set variables again and move on!
    me._id = sessionData._id;
    me.role = sessionData.role;

    return sessionData;
  }

  //get session data already now just to be sure (overkill?)
  // me.getSession();
  return me;
});