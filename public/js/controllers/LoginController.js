app.controller('LoginController', function ($scope, $location, $rootScope, $routeParams, AUTH_EVENTS, USER_ROLES, AuthService, mongoService, Session) {
  $scope.isCreateView = $location.path().search("admin/users/create") >= 0 ? true : false;
  $scope.isEditView = $location.path().search("admin/users/edit") >= 0 ? true : false;
  var userResource = mongoService.users();

  var userRoles = [];
  for(var i in USER_ROLES) {
    if (USER_ROLES[i] != "*") {
      userRoles.push({name: USER_ROLES[i]});
    }
  }
  
  $scope.register = {};
  $scope.registerHeading = "Register new user";    
  $scope.tagline = 'To the moon and back!';
  $scope.userList = userResource.index();
  $scope.userRoles = userRoles;
  $scope.userMessage = false;

  if ($scope.isEditView) {
    $scope.registerHeading = "Update user details";
    var editUserID = $routeParams.id;
    console.log("editUserID: ", editUserID);
    userResource.show({"id": editUserID}, function(res){
      for (var i in $scope.userRoles) {
        if ($scope.userRoles[i].name == res.role) {
          res.role = $scope.userRoles[i];
          console.log("userData role", res);
        }
      }
      $rootScope.$broadcast("updatedUserData", res);
    });
  }

  $rootScope.$on("updatedUserData", function(event, next) {
    //when we recieve data for edit, re-check some important scope variables
    $scope.isCreateView = $location.path().search("admin/users/create") >= 0 ? true : false;
    $scope.isEditView = $location.path().search("admin/users/edit") >= 0 ? true : false;
    $scope.userData = $rootScope.userData;
  });

  //if no admin is created, allow user to create one.
  if (!AuthService.foundAdmin) {
    console.log("!foundAdmin", AuthService.foundAdmin);
    $scope.userMessage = "No admin has been created for this CMS, please create one now!";
    $scope.userRoles = [{name: "admin", selected: "selected"}];
    $scope.register.role = $scope.userRoles[0];
    $scope.registerHeading = "Create new admin user";  
  }

  $scope.goToEdit = function(user_id) {
    //function that goes to /create or /edit/:id
    if (user_id) {
      $location.path("/admin/users/edit/"+user_id);
    } else {
      $location.path("/admin/users/create");
    }
  }

  //our login function
  $scope.login = function (credentials) {
    //AuthService deals with all authentication of users
    AuthService.login(credentials);
  };
  
  $scope.create = function (credentials) {
    //AuthService deals with all authentication of users
    console.log("login create: ", !credentials.username || !credentials.password || !credentials.role)
    if (!credentials.username || !credentials.password || !credentials.role) {
      $scope.userMessage = "Please fill in all the fields!";
    } else {
      jQuery("div.userMessage").hide();
      credentials.role = credentials.role.name;
      AuthService.create(credentials);
      if (Session.getSession()) {
        $location.path("/admin/users");
      }
    }
  };

  $scope.updateUser = function(userData) {
    userData.role = userData.role.name;
    userResource.update(userData);
    var currentSessionData = Session.getSession();
    if (currentSessionData._id === userData._id) {
      Session.updateSession(userData);
      $rootScope.$broadcast("currentSessionDataUpdated");
    }
    console.log("updateUser userData: ", userData);
    $location.path("/admin/users");
    $scope.userData = null;
  }

  $scope.deleteUser = function(user_id){
    //enter id to be deleted as object :D
    var confirmDelete = confirm("Do you really want to delete this user?");
    if (confirmDelete) {
      var confirmDeleteCurrentUser = confirm("Deleting your currently logged in user will log you out, do you wish to proceed?");
      var currentSessionData = Session.getSession();
      if (confirmDeleteCurrentUser) {
        if (currentSessionData._id === user_id) {
          AuthService.logout();
          location.href="/";
        }
        userResource.destroy({"id": user_id});
        $scope.userList = userResource.index();
        $location.path("/admin/users");
      }
    }
  }
});