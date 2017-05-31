"use strict";

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module("webApp", [
    "ngCookies",
    "ngRoute",
    "ui.bootstrap",
    "ui.grid",
    "ui.grid.pagination",
    "ui.grid.resizeColumns"
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/records.html",
        controller: "RecordsCtrl",
        controllerAs: "vm"
      })
      .when("/upload", {
        templateUrl: "views/upload.html",
        controller: "UploadCtrl",
        controllerAs: "vm"
      })
      .when("/delete", {
        templateUrl: "views/bulkDelete.html",
        controller: "BulkDeleteCtrl",
        controllerAs: "vm"
      })
      .when("/adminLogin", {
        templateUrl: "views/adminPassword.html",
        controller: "adminLoginCtrl",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/"
      });
  }])
  .run(["$rootScope", "$location", "$cookieStore", "$http", function ($rootScope, $location, $cookieStore, $http) {
      // Keep user logged in after page refresh
      $rootScope.globals = $cookieStore.get("globals") || {};
      if ($rootScope.globals.currentUser) {
          $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      $rootScope.$on("$locationChangeStart", function () {
          // Redirect to login page if not logged in and trying to access a restricted page
          var restrictedPage = $.inArray($location.path(), ["", "/"]) === -1;
          var loggedIn = $rootScope.globals.currentUser;
          if (restrictedPage && !loggedIn && $location.$$path !== "/adminLogin") {
              $rootScope.restrictedPage = $location.$$path;
              $location.path("/adminLogin");
          }
      });
  }]);
