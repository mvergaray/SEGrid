'use strict';

/**
 * @ngdoc function
 * @name webApp.directive:fileModel
 * @description
 * # fileModel
 * Directive of the webApp
 */
angular.module("webApp").
    service("multipartForm", ["$http", "$q", function ($http, $q) {
        this.post = function (data) {
            var defer = $q.defer(),
                fd = new FormData(),
                key;

            for (key in data) {
                fd.append("uploadFile", data[key]);
            }

            $http.post(se_api.basePath + "records/upload", fd, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                    "Accept": "application/json, text/plain"
                }
            })
            .success(defer.resolve)
            .error(defer.reject);

            return defer.promise;
        };
    }]);