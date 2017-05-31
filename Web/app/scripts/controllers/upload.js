'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('UploadCtrl',["$scope", "multipartForm", function ($scope, multipartForm) {
    $scope.customer = {};
    $scope.isLoading = false;
    $scope.disableSubmit = false;
    $scope.callSucced = false;

    function resetValues() {
        $scope.customer = {};
        $scope.isLoading = false;
        $scope.disableSubmit = false;
        angular.element("#registrosForm")[0].reset();
    }

    $scope.saveData = function () {
        if ($scope.customer && Object.keys($scope.customer).length){
            $scope.nroRegistros = "";
            $scope.errorMsg = "";
            $scope.isLoading = true;
            $scope.disableSubmit = true;
            $scope.callSucced = false;

            multipartForm.post($scope.customer).then(function (response) {
                $scope.nroRegistros = response;
                $scope.callSucced = true;
                resetValues();
            }, function (error) {
                $scope.errorMsg = error && error.message ? error.message : "Error de comunicación con el servidor";
                resetValues();
            });
        }
    };
  }]);
