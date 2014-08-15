app.controller('ApplicationController', function ($scope, $location, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, mongoService, Session) {
  //application controller is the "root" level controller
  //currently used to keep user variables easily accessible
  var tagsResource = mongoService.tags();
  var postResource = mongoService.posts();
  $scope.allTags = tagsResource.index();
  $scope.blogTitle = "The Blog Name";
  updateScope();
  $rootScope.$on(AUTH_EVENTS.loginSuccess, updateScope);
  $rootScope.$on(AUTH_EVENTS.loginFailed, loginfail);
  $rootScope.$on(AUTH_EVENTS.loginFailed, updateScope);
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, updateScope);
  $rootScope.$on("updatedPostData", updatePostDataScope);
  $rootScope.$on("updatedUserData", updateUserDataScope);
  $rootScope.$on("currentSessionDataUpdated", updateScope);
  $rootScope.$on("updatedShowPosts", updateShowPosts);

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, next) {
    console.log("Recieved Login", AuthService.foundAdmin);
    updateScope();
    $location.path("/admin");
  });

  $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, next) {
    $location.path("/login");
  });

  jQuery("div.menu").hide();
  $scope.showMenu = function () {
    jQuery("div.menu").toggle(200);
    //jQuery("body").css('border-right-width','110px')
  }

  $scope.findPostsByTag = function(tag_id) {
    postResource.index(function(res) {
      var postsToShow = [];
      for(var i = 0; i < res.length; i++) {
        var theseTags = res[i].tags;
        for (var j = 0; j < theseTags.length; j++) {
          if (theseTags[j]._id == tag_id) {
            postsToShow.push(res[i]);
          }
        }
      }

      $rootScope.$broadcast("updatedShowPosts", postsToShow);
    });
  }
  
  $scope.takeMeHome = function() {
    $location.path("/");  
    postResource.index(function(res) {
      for (var i = 0; i < res.length; i++) {
        var date = new Date(res[i].timeStamp);
        res[i].timeCreated = date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear();
      }

      $rootScope.$broadcast("updatedShowPosts", res);
    });
  }

  function updateScope(){
    $scope.currentUser = Session.getSession();
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isAuthenticated = AuthService.isAuthenticated;
    $scope.logout = function() {
      //wrapped in a function in case we want to add more stuff here :)
      Session.destroy();
      $location.path("/");
      // Eriks masterpiece. 
      updateScope();
    };
  }

  function updatePostDataScope(event, next) {
    var newPostData = {};
    newPostData.author = next.author;
    newPostData.title = next.title;
    newPostData.content = next.content;
    newPostData._id = next._id;

    $rootScope.postData = newPostData;
    updateScope();
  }

  function updateUserDataScope(event, next) {
    $rootScope.userData = next;

    updateScope();
  }

  function updateShowPosts(event, next) {
    $rootScope.showPosts = next;

    updateScope();
  }

  function loginfail(){
    alert("Login failed");
  }

});