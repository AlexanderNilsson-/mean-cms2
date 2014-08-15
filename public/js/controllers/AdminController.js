app.controller('AdminController', function($scope, $rootScope, mongoService, $location, $routeParams, Session, AuthService) {
  var postsResource = mongoService.posts();
  var tagsResource = mongoService.tags();

  tagsResource.show({id:"53ecba7fb3986c5a3ea22390"}, function(res) {
    console.log("tagsResource.show ", res);
  });

  $scope.currentUser = Session.getSession();
  $scope.showPosts = postsResource.index();

  //scope variables to
  $scope.showPostList = true;
  $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
  $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;
  $scope.showPostList = (!$scope.isCreateView && !$scope.isEditView) ? true : false;

  if ($scope.isEditView) {
    var editPostID = $routeParams.id;
    postsResource.show({"id": editPostID}, function(res){
      $rootScope.$broadcast("updatedPostData", res);
    });
  }

  $rootScope.$on("updatedPostData", function(event, next) {
    //when we recieve data for edit, re-check some important scope variables
    $scope.showPostList = (!$scope.isCreateView && !$scope.isEditView) ? true : false;
    $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
    $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;
    $scope.postData = $rootScope.postData;
  });

  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    credentials.role = credentials.role.name;
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
    message.tags = ["53ecbf6426ef15fc1f0b2f3b"];
    message.author = $scope.currentUser.username;
    postsResource.create(message);
    alert("Your message has been posted");
    $location.path("/");
  }

  $scope.updateMessage = function(message) {
    postsResource.update(message);
    $location.path("/admin")
    $scope.postData = null;
  }
  
  $scope.deletePost = function(post_id){
    //enter id to be deleted as object :D
    var confirmDelete = confirm("Do you really want to delete this post?");
    if (confirmDelete) {
      postsResource.destroy({"id": post_id});
      $scope.showPosts = postsResource.index();
      $location.path("/admin");
    }
  }
  
  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  //$scope.findContact = mongoService.index();
});