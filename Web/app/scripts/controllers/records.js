'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:RecordsCtrl
 * @description
 * # RecordsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('RecordsCtrl',["$scope", "$uibModal","$window", "i18nService", "RecordService", "uiGridConstants",
  function ($scope, $uibModal, $window, i18nService, RecordService, uiGridConstants) {
    var filters = {};

    i18nService.setCurrentLang('es');

    $scope.pagination = {
        pageSize: 25,
        pageNumber: 1,
        getTotalPages: function () {
            return Math.ceil(this.totalItems / this.pageSize) || 1;
        },
        nextPage: function () {
            if (this.pageNumber < this.getTotalPages()) {
                this.pageNumber++;
                $scope.load();
            }
        },
        previousPage: function () {
            if (this.pageNumber > 1) {
                this.pageNumber--;
                $scope.load();
            }
        }
    };

    $scope.startDate = {
        date: "",
        time: 0
    };
    $scope.endDate = {
        date: "",
        time: 0
    };
    $scope.orderBy = "";

    $scope.filtersChanged = function () {
        var dateParts = [];

        // Special filter for dates
        dateParts = $scope.startDate.date.split('/');
        $scope.startDate.time = dateParts && dateParts.length === 3 ?
                (new Date(dateParts[2], dateParts[1] - 1, dateParts[0])).getTime() :
                0;

        dateParts = $scope.endDate.date.split('/');
        $scope.endDate.time = dateParts && dateParts.length === 3 ?
                (new Date(dateParts[2], dateParts[1] - 1, dateParts[0])).getTime() :
                0;

        filters = {
            code: $scope.gridApi.grid.columns[1].filters[0].term || undefined,
            document: $scope.gridApi.grid.columns[2].filters[0].term || undefined,
            destination: $scope.gridApi.grid.columns[3].filters[0].term || undefined,
            address: $scope.gridApi.grid.columns[4].filters[0].term || undefined,
            district: $scope.gridApi.grid.columns[5].filters[0].term || undefined,
            sender: $scope.gridApi.grid.columns[8].filters[0].term || undefined,
            orderBy: $scope.orderBy || undefined,
            startDate: $scope.startDate.time,
            endDate: $scope.endDate.time
        };
        $scope.load(filters);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    };

    $scope.gridOptions = {
        excludeProperties: '__metadata',
        enableFiltering: true,
        enableColumnMenus: false,
        paginationPageSizes: [25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        enableSorting: true,
        showFooter: false,
        enableColumnResize: true,
        appScopeProvider: $scope,
        rowTemplate: "<div ng-dblclick=\"grid.appScope.openModal(row.entity)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
        columnDefs: [
            {
                field: "code",
                displayName: "PDF",
                cellTemplate: "<div class='center pointer' title='Fecha de creación: {{ row.entity.formatCreationDate }}' ng-click='grid.appScope.downloadReceipts(row.entity.code)'><i class='fa fa-file-pdf-o'></i></div>",
                width: 50,
                enableFiltering: false,
                enableColumnResizing: false,
                enableSorting: false
            },
            { field: "code", displayName: "Código", cellTooltip: true, minWidth: 110, enableSorting: false },
            { field: "document", displayName: "Nro. Doc.", cellTooltip: true, minWidth: 150, enableSorting: false },
            { field: "destination", displayName: "Destino", cellTooltip: true, minWidth: 150, enableSorting: false },
            { field: "address", displayName: "Dirección", cellTooltip: true, minWidth: 150, enableSorting: false },
            { field: "district", displayName: "Distrito", cellTooltip: true, minWidth: 120, enableSorting: false },
            {
                field: "time",
                displayName: "Fecha",
                cellTemplate: "<div class='center' ng-bind='row.entity.date ? row.entity.formatDate : \"-\" '></div>",
                cellTooltip: true, width: 100,
                enableColumnResizing: false,
                enableSorting: true,
                sort: { direction: uiGridConstants.DESC },
                sortingAlgorithm: function () {
                    return 0;
                },
                suppressRemoveSort: true,
                filters: [
                    {
                      condition: function () {
                        return true;
                      }
                    },
                    {
                      condition: function () {
                        return true;
                      }
                    }
                ],
                filterFunction: function () {
                    return true;
                },
                filterHeaderTemplate: '<div class="ui-grid-filter-container">' +
                    '<input class="ui-grid-filter-input" date-picker type="text" ng-model="grid.appScope.startDate.date" ng-change="grid.appScope.filtersChanged()" placeholder="Desde"/>' +
                    '<input class="ui-grid-filter-input" date-picker type="text" ng-model="grid.appScope.endDate.date" ng-change="grid.appScope.filtersChanged()" placeholder="Hasta"/></div>'
            },
            { field: "province", displayName: "Dpto.", cellTooltip: true, width: 80, enableColumnResizing: false, enableSorting: false },
            { field: "sender", displayName: "Remitente", cellTooltip: true, minWidth: 150, enableSorting: false },
            { field: "reference", displayName: "Referencia", cellTooltip: true, minWidth: 100, enableColumnResizing: false, enableSorting: false },
            { field: "detail", displayName: "Detalle", cellTooltip: true, minWidth: 70, enableColumnResizing: false, enableSorting: false, visible: false }
        ],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;

            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.pagination.pageNumber = newPage;
                $scope.pagination.pageSize = pageSize;
                $scope.load(filters);
            });
            $scope.gridApi.core.on.filterChanged($scope, $scope.filtersChanged);

            $scope.gridApi.core.on.sortChanged($scope, function (grid, columns) {
                $scope.orderBy = [];

                if (columns && columns.length) {
                    columns.forEach(function (column) {
                        column.sort.priority = null;
                        $scope.orderBy.push(
                            (["formatDate","time"].indexOf(column.field) > -1 ? "DATE" : column.field) +
                            " " + column.sort.direction
                        );
                    });
                }

                $scope.orderBy = $scope.orderBy.join(", ");

                filters = {
                    code: $scope.gridApi.grid.columns[1].filters[0].term || undefined,
                    document: $scope.gridApi.grid.columns[2].filters[0].term || undefined,
                    destination: $scope.gridApi.grid.columns[3].filters[0].term || undefined,
                    address: $scope.gridApi.grid.columns[4].filters[0].term || undefined,
                    district: $scope.gridApi.grid.columns[5].filters[0].term || undefined,
                    sender: $scope.gridApi.grid.columns[6].filters[0].term || undefined,
                    orderBy: $scope.orderBy || undefined,
                    startDate: $scope.startDate.time,
                    endDate: $scope.endDate.time
                };
                $scope.load(filters);
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
            });
        }
    };

    $scope.load = function (filters) {
        var params = filters || {};

        params.pageStart = $scope.pagination.pageSize * ($scope.pagination.pageNumber -1);
        params.pageCount = $scope.pagination.pageSize;

        RecordService.readAll(params).then(function (response) {
            $scope.gridOptions.data = response.data;
            $scope.gridOptions.totalItems = response.totalCount;
        });
    };

    $scope.downloadReceipts = function (code) {
        RecordService.getFilesName({ code: code }).then(function (data) {
            if (data && data.length) {
                data.forEach(function (fileName) {
                    $window.location = se_api.basePath + "records/download?code=" + fileName;
                });
            } else {
                createAutoClosingAlert("No se encontró ningún registro con código:" + code);
            }
        }, function () {
            createAutoClosingAlert("No se encontró ningún registro con código:" + code);
        });
    };

    function createAutoClosingAlert(msg, style) {
       var alert = $("#warningAlert");

       $scope.alertMsg = msg;
       $scope.alertStyle = style || "warning";
       alert.show();
       // Hide alerft after 5 seconds
       window.setTimeout(function() { alert.hide(); }, 5000);
    }

    $scope.openModal = function (record) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/record.html',
          controller: 'RecordCtrl',
          size: "lg",
          resolve: {
            model: function () {
              return record;
            }
          }
        });

        modalInstance.result.then(function () {
          $scope.load(filters);
          createAutoClosingAlert("Registro actualizado.", "success");
        }, function (reason) {
            if (["cancel", "backdrop click"].indexOf(reason) == -1) {
                createAutoClosingAlert("Error al actualizar registro.", "danger");
            }
        });
    };

    $scope.load(filters);
  }]);
