app.controller('LoginController', function ($scope, $location, $rootScope, AUTH_EVENTS, AuthService, mongoService) {
  $scope.tagline = 'To the moon and back!';

  //our login function
  $scope.login = function (credentials) {
    //AuthService deals with all authentication of users
    var success = AuthService.login(credentials);

    if (success) {
      $location.path("/admin");
    } else {
      $location.path("/login");
    }
  };

  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    AuthService.create(credentials);
  };

});