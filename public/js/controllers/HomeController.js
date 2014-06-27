app.controller('HomeController',['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $routeParams, $location) {
  
  $scope.showPosts = mongoService.index();
  
  $scope.deletePost = function(postID){
    console.log(postID);

    mongoService.destroy(postID);
  }

}]);