app.controller('AdminController', ['$scope', '$rootScope','mongoService', '$location', '$routeParams','Session', 'AuthService', function($scope, $rootScope, mongoService, $location, $routeParams, Session, AuthService) {
  var postsResource = mongoService.posts();
  $scope.currentUser = Session.getSession();
  $scope.showPosts = postsResource.index();
  $scope.showPostList = true;
  $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
  $scope.isEditView = $location.path().search("admin/edit") >= 0 ? true : false;

  $scope.newEditDialog = function(post_id) {
    var formHtml = '';
    if (post_id) {
      formHtml += '<div id="updatePostWrapper">';
      formHtml += '<h3>Update post</h3>';
    } else {
      formHtml += '<div id="createPostWrapper">';
      formHtml += '<h3>Create new post</h3>';
    }

    formHtml += '<form>';
    if (!post_id) {
      formHtml += '<br>';
      formHtml += '<input type="text" name="title" id="title" ng-model="newPost.title" placeholder="Title">';
      formHtml += '<br>';
      formHtml += '<textarea rows="3" cols="70" ng-model="newPost.content" id="new-message" placeholder="Write your post here..."></textarea>';
      formHtml += '<button ng-click="insertNewMessage(newPost)">Send</button>';
    } else {
      formHtml += '<br>';
      formHtml += '<input type="text" name="title" id="title" ng-model="postData.title" ng-value="postData.title" placeholder="Title">';
      formHtml += '<br>';
      formHtml += '<textarea rows="3" cols="70" ng-model="postData.content" ng-value="postData.content" id="new-message" placeholder="Write your post here..."></textarea>';
      formHtml += '<button ng-click="updateMessage(postData)">Send</button>';
    }

    formHtml += '</form>';
    formHtml += '</div>';

    console.log("post_id", post_id);

    $scope.showPostList = false;
    jQuery("div#adminEditorMainDiv").html(formHtml);
    }

  if ($scope.isCreateView || $scope.isEditView) {
    var updateId = $routeParams["id"] ? $routeParams["id"] : false;
    $scope.newEditDialog(updateId);
  }

  $rootScope.$on('$locationChangeStart', function (event, next) {
    var updateId = $routeParams.id ? $routeParams.id : false;
    $scope.isCreateView = $location.path().search("admin/create") >= 0 ? true : false;
    $scope.isEditView = $location.path().search("admin/edit/") >= 0 ? true : false;

    if (updateId) {
      var postData = postsResource.show({"id": updateId});
      $scope.postData = postData ? postData : false;
    }
    if ($scope.isCreateView || $scope.isEditView) {
      $scope.newEditDialog(updateId);
    }

    console.log("isEditView: ", $scope.isEditView, " isCreateView: ", $scope.isCreateView)
    console.log/("showPostList", $scope.showPostList);
    console.log("routeParams: ", $routeParams);
    console.log("updateId: ", updateId);
    console.log("postData updated! ",postData);
  });

  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    credentials.userRole = document.getElementById("userRole").value
    AuthService.create(credentials);
  }

  $scope.goToEdit = function(post_id) {
    if (post_id) {
      // $location.path("/admin/edit/").search({"id":post_id});
      var newPath = "/admin/edit/"+post_id;
      $location.path(newPath);
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