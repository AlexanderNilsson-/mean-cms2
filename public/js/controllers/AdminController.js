app.controller('AdminController', ['$scope','mongoService', '$location', '$routeParams','Session', 'AuthService', function($scope, mongoService, $location, $routeParams, Session, AuthService) {
  var postsResource = mongoService.posts();
  $scope.currentUser = Session.getSession();


  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    credentials.userRole = document.getElementById("userRole").value
    AuthService.create(credentials);
  };


  $scope.insertNewMessage = function(message) {
    message.author = $scope.currentUser.username;
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