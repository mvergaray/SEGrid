'use strict';

angular.module('webApp')
    .service('RecordService', ['$http', function RecordService($http) {
        var self = this;
        var objectName = 'records';
        self.readAll = function (filters) {
            return $http({
                method: 'GET',
                url: se_api.basePath + objectName + "/list",
                params: filters
            }).then(function (response) {
                var result = response.data,
                    date;

                if (result.data && result.data.length) {
                    result.data.forEach(function (record) {
                        // Format record date
                        date = new Date(record.date);
                        record.formatDate = date.customFormat("#DD#/#MM#/#YYYY#");
                        // Format creation date
                        date = new Date(record.creationDate);
                        record.formatCreationDate = date.customFormat("#DD#/#MM#/#YYYY# - #hh#:#mm#:#ss#");
                    });
                }

                return result;
            });
        };
        self.update = function (data) {
            return $http({
                method: 'PUT',
                url: se_api.basePath + objectName + "/update",
                data: data,
                headers: {
                   'Content-Type': "application/json"
                }
            });
        };
        self.getFilesName = function (params) {
            return $http({
                method: "GET",
                url: se_api.basePath + objectName + "/getFilesName",
                params: params
            }).then(function (response) {
                return response.data;
            });
        };
        self.getCreationCodeList = function () {
            return $http({
                method: "GET",
                url: se_api.basePath + objectName + "/creation_code_list"
            }).then(function (response) {
                var result = [],
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    seconds,
                    formatDate;

                if (response.data && response.data.length) {
                    response.data.forEach(function (creationCode) {
                        /*
                         * Format creation code to date time
                         * Creation code is in format yyMMddHHmm
                         */
                        year = creationCode.substr(0, 4);
                        month = creationCode.substr(4, 2);
                        day = creationCode.substr(6, 2);
                        hour = creationCode.substr(8, 2);
                        minute = creationCode.substr(10, 2);
                        seconds = creationCode.substr(12, 2);

                        formatDate = day + "/" + month + "/" + year + " - " + hour + ":" + minute + ":" + seconds;
                        result.push(
                        {
                            creationCode: creationCode,
                            date: formatDate
                        });
                    });
                }
                return result;
            });
        };
        self.deleteRecords = function (creationCode) {
            return $http({
                method: 'DELETE',
                url: se_api.basePath + objectName + "/delete?creationCode=" + creationCode
            }).then(function (response) {
                return response.data;
            });
        };
}]);