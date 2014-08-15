app.controller('HomeController',function($scope, mongoService, $routeParams, $rootScope, $location, AuthService, USER_ROLES, Session) {
  $scope.userRoles = USER_ROLES;
  $scope.currentUser = Session.getSession();
  console.log("location", $location.path());
  
  if ($location.path().search("view/") >= 0) {
    var postsResource = mongoService.posts();
    $scope.showPosts = [];
    postsResource.show({"id": $routeParams.id}, function(res) {
      res = [res];
      $rootScope.$broadcast("updatedShowPosts", res);
    });
    //$scope.showPosts.push(postsResource.show({"id": $routeParams.id}));
  } else {
    var postsResource = mongoService.posts();
    //$scope.showPosts = 
    postsResource.index(function(res) {
      for (var i = 0; i < res.length; i++) {
        var date = new Date(res[i].timeStamp);
        res[i].timeCreated = date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear();
      }

      $rootScope.$broadcast("updatedShowPosts", res);

      return res;
    });
  }

  $rootScope.$on("updatedShowPosts", function(event, showPosts) {
    $scope.showPosts = showPosts;
  })

  console.log($scope.showPosts)
  $scope.deletePost = function(post_id){
    //enter id to be deleted as object :D
    var confirmDelete = confirm("Do you really want to delete this post?");
    if (confirmDelete) {
      postsResource.destroy({"id": post_id});
      $scope.showPosts = postsResource.index();
      $location.path("/admin");
    }
  }
});