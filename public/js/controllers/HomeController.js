app.controller('HomeController',['$scope', 'mongoService', '$location', '$routeParams', 'AuthService','USER_ROLES','Session', function($scope, mongoService, $routeParams, $location, AuthService, USER_ROLES, Session) {
  $scope.userRoles = USER_ROLES;
  $scope.currentUser = Session.getSession();
  
  var postsResource = mongoService.posts();
  $scope.showPosts = postsResource.index();
  
  $scope.deletePost = function(postID){
    //enter id to be deleted as object :D
    postsResource.destroy({"id": postID});
    $scope.showPosts = postsResource.index();
  }
}]);