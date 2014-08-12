app.controller('AdminController', ['$scope', '$rootScope','mongoService', '$location', '$routeParams','Session', 'AuthService', function($scope, $rootScope, mongoService, $location, $routeParams, Session, AuthService) {
  var postsResource = mongoService.posts();
  $scope.currentUser = Session.getSession();
  $scope.showPosts = postsResource.index();

  //scope variables to
  $scope.showPostList = true;
  $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
  $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;
  $scope.showPostList = (!$scope.isCreateView && !$scope.isEditView) ? true : false;

  $rootScope.$on("updatedPostData", function(event, next) {
    //when we recieve data for edit, re-check some important scope variables
    $scope.showPostList = (!$scope.isCreateView && !$scope.isEditView) ? true : false;
    $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
    $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;
    $scope.postData = $rootScope.postData;
  });

  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    credentials.userRole = document.getElementById("userRole").value
    AuthService.create(credentials);
  }

  $scope.goToEdit = function(post_id) {
    //function that goes to /create or /edit/:id
    if (post_id) {
      postsResource.show({"id": post_id}, function(res){
        $rootScope.$broadcast("updatedPostData", res);
      });

      $location.path("/admin/edit/"+post_id);
    } else {
      $location.path("/admin/create");
    }
  }

  $scope.insertNewMessage = function(message) {
    var timeStamp = new Date().getTime();
    message.timeStamp = timeStamp;
    message.author = $scope.currentUser.username;
    postsResource.create(message);
    jQuery("div#createPostDialog").remove();
    alert("Your message has been posted");
    $location.path("/");
  }

  $scope.updateMessage = function(message) {
    postsResource.update(message);
    jQuery("div#updatePostDialog").remove();
    $location.path("/admin")
    $scope.postData = null;
  }
  
  $scope.deletePost = function(post_id){
    //enter id to be deleted as object :D
    postsResource.destroy({"id": post_id});
    $scope.showPosts = postsResource.index();
  }
  
  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  //$scope.findContact = mongoService.index();
}]);