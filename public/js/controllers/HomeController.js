app.controller('HomeController',function($scope, mongoService, $routeParams, $location, AuthService, USER_ROLES, Session) {
  $scope.userRoles = USER_ROLES;
  $scope.currentUser = Session.getSession();

  console.log("location", $location.path());
  
  if ($location.path().search("view/") >= 0) {
    var postsResource = mongoService.posts();
    $scope.showPosts = [];
    $scope.showPosts.push(postsResource.show({"id": $routeParams.id}));
  } else {
    var postsResource = mongoService.posts();
    $scope.showPosts = postsResource.index();
  }
  
  $scope.deletePost = function(post_id){
    //enter id to be deleted as object :D
    var confirmDelete = confirm("Do you really want to delete this post?");
    if (confirmDelete) {
      postsResource.destroy({"id": post_id});
      $scope.showPosts = postsResource.index();
    }
  }
});