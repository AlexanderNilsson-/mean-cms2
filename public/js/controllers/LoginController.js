app.controller('LoginController', function ($scope, $location, $rootScope, AUTH_EVENTS, AuthService, mongoService, Session) {
  $scope.tagline = 'To the moon and back!';

  //our login function
  $scope.login = function (credentials) {
    //AuthService deals with all authentication of users
    AuthService.login(credentials);
    var success = Session.getSession();
    console.log("login success", success);
  };

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, next) {
    $location.path("/admin");
  });
  $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, next) {
    $location.path("/login");
  });
  
  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    AuthService.create(credentials);
  };

});