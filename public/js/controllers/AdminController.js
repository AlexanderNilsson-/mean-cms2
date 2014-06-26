app.controller('AdminController', ['$scope','mongoService', '$location', '$routeParams', function($scope, mongoService, $routeParams, $location) {

  $scope.contact = { firstname: 'string', lastname: 'string', age: 'number' };

  $scope.insertNewMessage = function(message) {
    mongoService.create(message);
  }

  $scope.updateMessage = function(message) {
    mongoService.update(message);
  }

  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  $scope.findContact = mongoService.index();
}]);