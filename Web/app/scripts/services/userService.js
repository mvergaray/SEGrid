'use strict';

angular.module('webApp')
    .factory('UserService', ["$filter", '$http', "$q", function ($filter, $http, $q) {
        var service = {};

        function getByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(_getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        // Private functions
        function _getUsers() {
            // TODO: Use when API gets done
            /*if(!localStorage.users){
                localStorage.users = JSON.stringify([{username:"admin", password:"Se3745W"}]);
            }*/

            // Temporary use local admin password
            localStorage.users = JSON.stringify([{username:"admin", password:"Se3745W"}]);
            return JSON.parse(localStorage.users);
        }

        service.GetByUsername = getByUsername;

        return service;
    }]);