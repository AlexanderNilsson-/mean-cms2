app.controller('AdminController', ['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $location, $routeParams) {
  var postsResource = mongoService.posts();
  $scope.contact = { firstname: 'string', lastname: 'string', age: 'number' };

  $scope.insertNewMessage = function(message) {
    postsResource.create(message);
    alert("Your message has been posted");
        $location.path("/");

  }

  $scope.updateMessage = function(message) {
    postsResource.update(message);
  }

  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  //$scope.findContact = mongoService.index();
}]);