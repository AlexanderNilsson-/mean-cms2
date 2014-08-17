app.controller('AdminController', function($scope, $rootScope, mongoService, $location, $routeParams, Session, AuthService) {
  var postsResource = mongoService.posts();
  var tagsResource = mongoService.tags();
  //var titlesResource = mongoService.titles();
  $scope.newTitle = {};
  $scope.newPost = {};
  $scope.newPost.tags = "";

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
    $scope.postData = $rootScope.postData;
    console.log("postData: ", $scope.postData);
    $scope.showPostList = (!$scope.isCreateView && !$scope.isEditView) ? true : false;
    $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
    $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;
  });

  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    credentials.role = credentials.role.name;
    AuthService.create(credentials);
  };

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
  };

  var allcreatedtags = [];

  $scope.insertTitle = function(title) {
   // titlesResource.create(title);
    console.log(title);
  };

  $scope.insertNewMessage = function(message) {
    var tags = message.tags;
    var timeStamp = new Date().getTime();
    message.timeStamp = timeStamp;
    message.author = $scope.currentUser.username;
    if (tags.length == 0) {
      message.tags = [];
      postsResource.create(message);
      $rootScope.$broadcast("updatedShowPosts");
      $scope.newPost = "";
      alert("Your message has been posted");
      $location.path("/");
    } else {
      tags = tags.split(" ");
      for (var i = 0; i < tags.length; i++) {
        tagsResource.create({"tag":tags[i]}, function(res) {
          res.amountToCreate = tags.length;
          $rootScope.$broadcast("newTagCreated", res);
        });
      }
    }
    
    $rootScope.$on("newTagCreated", function(event, next) {
      allcreatedtags.push(next._id);
      if (allcreatedtags.length == next.amountToCreate) {
        //post save function
        message.tags = allcreatedtags;
        postsResource.create(message);
        $rootScope.$broadcast("updatedShowPosts");
        $scope.newPost = "";
        alert("Your post has been posted");
        $location.path("/");
      }
    });
  };

  $scope.updateMessage = function(message) {
    var tags = message.tagStrings;
    if (tags.length == 0) {
      message.tags = [];
      postsResource.update(message);
      $rootScope.$broadcast("updatedShowPosts");
      $scope.postData = "";
      alert("Your post has been updated");
      $location.path("/admin");
    } else {
      tags = tags.split(" ");
      for (var i = 0; i < tags.length; i++) {
        tagsResource.create({"tag":tags[i]}, function(res) {
          res.amountToCreate = tags.length;
          $rootScope.$broadcast("newUpdateTagCreated", res);
        });
      }
    }
    
    var allcreatedtags = [];
    $rootScope.$on("newUpdateTagCreated", function(event, next) {
      allcreatedtags.push(next._id);
      if (allcreatedtags.length == next.amountToCreate) {
        console.log("allcreatedtags for update: ", allcreatedtags);
        //post update function
        message.tags = allcreatedtags;
        postsResource.update(message);
        $rootScope.$broadcast("updatedShowPosts");
        $scope.postData = "";
        alert("Your post has been updated!");
        $location.path("/admin");
      }
    });
  };
  
  $scope.deletePost = function(post_id){
    //enter id to be deleted as object :D
    var confirmDelete = confirm("Do you really want to delete this post?");
    if (confirmDelete) {
      postsResource.destroy({"id": post_id});
      $scope.showPosts = postsResource.index();
      $location.path("/admin");
    }
  };
  
  //mongoService.create($scope.contact, success, failure);
  $scope.tagline = 'Nothing beats a pocket protector!';
  //$scope.findContact = mongoService.index();
});