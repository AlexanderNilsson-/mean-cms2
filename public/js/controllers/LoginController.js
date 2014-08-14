app.controller('LoginController', function ($scope, $location, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService, mongoService, Session) {
  var userRoles = [];
  for(var i in USER_ROLES) {
    if (USER_ROLES[i] != "*") {
      userRoles.push({name: USER_ROLES[i]});
    }
  }
  $scope.register = {};
  $scope.tagline = 'To the moon and back!';
  $scope.userList = mongoService.register().index();
  $scope.userRoles = userRoles;
  $scope.userMessage = "";

  //if no admin is created, allow user to create one.
  if (!AuthService.foundAdmin) {
    console.log("foundAdmin", AuthService.foundAdmin);
    jQuery("div.userMessage").show();
    $scope.userMessage = "No admin has been created for this CMS, please create one now!";
    $scope.userRoles = [{name: "admin", selected: "selected"}];
    $scope.register.role = $scope.userRoles[0];
    jQuery("h3.registerHeading").text("Create new admin user");
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
      jQuery("div.userMessage").show();
      $scope.userMessage = "Please fill in all the fields!";
    } else {
      jQuery("div.userMessage").hide();
      credentials.role = credentials.role.name;
      AuthService.create(credentials);
      if (Session.getSession()) {
        $location.path("/admin/register");
      }
    }
  };
});