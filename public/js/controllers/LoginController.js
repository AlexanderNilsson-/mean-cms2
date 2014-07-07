app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, mongoService) {
  $scope.tagline = 'To the moon and back!';

  //our login function
  $scope.login = function (credentials) {
    //AuthService deals with all authentication of users
    AuthService.login(credentials);
  };
});