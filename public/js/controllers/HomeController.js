app.controller('HomeController',['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $routeParams, $location) {
  
  $scope.showPosts = mongoService.index();
  //$scope.showPosts = [mongoService.show()];
  $scope.deletePost = function(postID){
    console.log(postID);
    mongoService.destroy(postID);
  }

}]);