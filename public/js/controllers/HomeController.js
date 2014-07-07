app.controller('HomeController',['$scope', 'mongoService', '$location', '$routeParams', 'AuthService', function($scope, mongoService, $routeParams, $location, AuthService) {
  var postsResource = mongoService.posts();
  $scope.showPosts = postsResource.index();
  
  $scope.deletePost = function(postID){
    //enter id to be deleted as object :D
    postsResource.destroy({"id": postID});
    $scope.showPosts = postsResource.index();
  }
}]);