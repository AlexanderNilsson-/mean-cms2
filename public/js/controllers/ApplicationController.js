app.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, Session, $location) {
  //application controller is the "root" level controller
  //currently used to keep user variables easily accessible
  $scope.currentUser = Session.getSession();
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  $scope.logout = function() {
    //wrapped in a function in case we want to add more stuff here :)
    Session.destroy();
    $location.path("/");
  }
});