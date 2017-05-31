'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:adminLoginCtrl
 * @description
 * # adminLoginCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('adminLoginCtrl',["$scope", "$rootScope", "$location", "AuthenticationService",
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
            AuthenticationService.grantAdminAccess(vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.setCredentials(vm.username, vm.password);
                    $location.path($rootScope.restrictedPage ?
                            $rootScope.restrictedPage :
                            "/"
                        );
                } else {
                    vm.error = response.message;
                    vm.dataLoading = false;
                }
            });
        }

        vm.login = login;
  }]);