app.controller('ApplicationController', function ($scope, $location, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, Session) {
  //application controller is the "root" level controller
  //currently used to keep user variables easily accessible

  updateScope();
  $rootScope.$on(AUTH_EVENTS.loginSuccess, updateScope);
  $rootScope.$on(AUTH_EVENTS.loginFailed, loginfail);
  $rootScope.$on(AUTH_EVENTS.loginFailed, updateScope);
  $rootScope.$on("updatedPostData", updatePostDataScope);

  function updateScope(){
    $scope.currentUser = Session.getSession();
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isAuthenticated = AuthService.isAuthenticated;
    $scope.logout = function() {
      //wrapped in a function in case we want to add more stuff here :)
      Session.destroy();
      $location.path("/");
      // Eriks masterpiece. 
      updateScope();
    };
  }

  function updatePostDataScope(event, next) {
    var newPostData = {};
    newPostData.author = next.author;
    newPostData.title = next.title;
    newPostData.content = next.content;
    newPostData._id = next._id;

    $rootScope.postData = newPostData;
    updateScope();
  }

  function loginfail(){
    alert("Login failed");
  }

});