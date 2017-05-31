'use strict';

/**
 * @ngdoc function
 * @name webApp.directive:fileModel
 * @description
 * # fileModel
 * Directive of the webApp
 */
angular.module('webApp').
    directive("fileModel", ["$parse", function ($parse) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel),
                    modelSetter = model.assign;

                element.bind("change", function () {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);