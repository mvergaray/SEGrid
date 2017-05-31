'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('RecordCtrl',["$scope", "$modalInstance", "model", "RecordService",
    function ($scope, $modalInstance, model, RecordService) {
        $scope.record = angular.copy(model);

        $scope.ok = function () {
            var params = {
                address: $scope.record.address,
                code: $scope.record.code,
                destination: $scope.record.destination,
                detail: $scope.record.detail,
                district: $scope.record.district,
                document: $scope.record.document,
                idRecord: $scope.record.idRecord,
                province: $scope.record.province,
                reference: $scope.record.reference,
                sender: $scope.record.sender
            };

            RecordService.update(params).then(
                function () {
                    $modalInstance.close();
                }, function () {
                    $modalInstance.dismiss('error');
                });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
  }]);