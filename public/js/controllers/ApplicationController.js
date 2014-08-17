app.controller('ApplicationController', function ($scope, $location, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, mongoService, Session) {
  //application controller is the "root" level controller
  //currently used to keep user variables easily accessible
  var tagsResource = mongoService.tags();
  var postResource = mongoService.posts();
  $scope.isAuthorized = AuthService.isAuthorized;
  $scope.isAdmin = AuthService.isAdmin;

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
  $rootScope.$on('$locationChangeStart', updateScope);

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, next) {
    console.log("Recieved Login", AuthService.foundAdmin);
    updateScope();
    $location.path("/admin");
  });

  $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, next) {
    $location.path("/login");
  });

  function updateScope(){
    $scope.currentUser = Session.getSession();
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isAuthenticated = AuthService.isAuthenticated;
    $scope.isAdmin = AuthService.isAdmin;
    $scope.tagFilterBtnText = "Filter by tag";
    $scope.showSearchTagListDiv = false;
    $scope.logout = function() {
      //wrapped in a function in case we want to add more stuff here :)
      Session.destroy();
      $location.path("/");
      // Eriks masterpiece. 
      updateScope();
    };
  }

  $scope.allTags = [];
  getAllTags();

  function getAllTags() {
    //function to get all tags from posts, count them, and only display tags in tag cloud that are in use
    var amountOfUsedTags = {};
    tagsResource.index(function(allTags) {
      postResource.index(function(allPosts) {
        for(var i = 0; i < allPosts.length; i++) {
          var theseTags = allPosts[i].tags;
          for (var j = 0; j < theseTags.length; j++) {
            for (var x = 0; x < allTags.length; x++) {
              if (theseTags[j]._id == allTags[x]._id) {
                allTags[x].currentAmountInUse = allTags[x].hasOwnProperty("currentAmountInUse") ? allTags[x].currentAmountInUse+1 : 1;
              }
            }
          }
        }

        var tagsInUse = []; 
        for (var y = 0; y < allTags.length; y++) {
          if (allTags[y].hasOwnProperty("currentAmountInUse")) {
            if (allTags[y].currentAmountInUse > 1) {
              allTags[y].fontSize = "1."+allTags[y].currentAmountInUse+"em";
            } else {
              allTags[y].fontSize = "1em";
            }

            tagsInUse.push(allTags[y]);
          }
        }
        $scope.allTags = tagsInUse;
      });
    });
  }


  jQuery("div.menu").hide();
  $scope.showMenu = function () {
    jQuery("div.menu").toggle(200);
    //jQuery("body").css('border-right-width','110px')
  }

  $scope.tagFilterBtnText = "Filter by tag";
  $scope.showSearchTagListDiv = false;

  $scope.showSearchTagList = function() {
    var show = !$scope.showSearchTagListDiv ? true : false;
    if (show) {
      $scope.tagFilterBtnText = "Cancel";    
    } else {
      $scope.tagFilterBtnText = "Filter by tag";
    }
    jQuery("div.searchTagsList").toggle();
    $scope.showSearchTagListDiv = show;
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

  function updatePostDataScope(event, next) {
    var newPostData = {};
    newPostData.author = next.author;
    newPostData.title = next.title;
    newPostData.content = next.content;
    newPostData.tags = next.tags;
    newPostData.tagStrings = "";

    for(var i = 0; i < newPostData.tags.length; i++) {
      newPostData.tagStrings += newPostData.tags[i].tag;
      console.log("newPostData.tags[i].tag: ", newPostData.tags[i].tag);
      if (i != newPostData.tags.length-1) {
        newPostData.tagStrings += " ";
      }
    }
    newPostData._id = next._id;

    $rootScope.postData = newPostData;
    updateScope();
  }

  function updateUserDataScope(event, next) {
    $rootScope.userData = next;

    updateScope();
  }

  function updateShowPosts(event, next) {
    if (!next) {
      next = postResource.index();
    }

    $rootScope.showPosts = next;
    getAllTags();

    updateScope();
  }

  function loginfail(){
    alert("Login failed");
  }

});