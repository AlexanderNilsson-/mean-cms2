app.controller('AdminController', ['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $routeParams, $location) {
  var postsResource = mongoService.posts();
  $scope.contact = { firstname: 'string', lastname: 'string', age: 'number' };

  $scope.insertNewMessage = function(message) {
    postsResource.create(message);
  }

  $scope.updateMessage = function(message) {
    postsResource.update(message);
  }

  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  //$scope.findContact = mongoService.index();
}]);