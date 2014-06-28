app.controller('HomeController',['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $routeParams, $location) {
  $scope.showPosts = mongoService.index();
  
  $scope.deletePost = function(postID){
    //enter id to be deleted as object :D
    mongoService.destroy({"id": postID});
    $scope.showPosts = mongoService.index();
  }
}]);