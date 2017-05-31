'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('LoginCtrl',["$scope", "$rootScope", "$location", "AuthenticationService",
    function ($scope, $rootScope, $location, AuthenticationService) {
        var vm = this;

        $rootScope.authorized = false;

        $scope.submit = function () {
            if ($scope.user && $scope.password) {
                $rootScope.authorized = true;
                $location.path("/records");
            }
        };

        (function initController() {
            // Reset login status
            AuthenticationService.clearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    vm.error = response.message;
                    vm.dataLoading = false;
                }
            });
        }

        vm.login = login;
  }]);