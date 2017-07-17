(function() {
    'use strict';

    angular
        .module('app.datatable')
        .controller('DatatableController', DatatableController);

    /** @ngInject */
    function DatatableController($http, $scope, $compile, $mdToast, $rootScope, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;
        $scope.Name = "";
        // vm.dtOptions = DTOptionsBuilder.newOptions()
        //     .withOption('ajax', {
        //         // Either you specify the AjaxDataProp here
        //         // dataSrc: 'data',
        //         type: 'GET',
        //         url: $rootScope.RoutePath + "customer/GetAllMedia",

        //     })
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(10)
        //     .withOption('responsive', true)
        //     .withOption('autoWidth', true)
        //     // .withOption('paging', false)
        //     // .withOption('deferRender', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //     .withOption('dom', '<"top"<"left"<"length"l>>f>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>')
        //     .withDataProp('data')
        //     .withOption('processing', true)
        //     .withOption('serverSide', true);


        // vm.dtColumns = [
        //     DTColumnBuilder.newColumn('id').withTitle('ID'),
        //     DTColumnBuilder.newColumn('FileName').withTitle('First name'),
        //     DTColumnBuilder.newColumn('Author').withTitle('Last name'),
        //     DTColumnBuilder.newColumn(null).withTitle('Action').notSortable().renderWith(function(data, type, full, meta) {
        //         // if (data.status != "CLOSED") {
        //         //     return '<button class="btn btn-primary" ng-click="edit(' + data.id + ')">' +
        //         //         '   <i class="fa fa-eye"></i>' + "View" +
        //         //         '</button>&nbsp;' + '<button class="btn btn-warning" ng-click="edit(' + data.id + ')">' +
        //         //         '   <i class="fa fa-edit"></i>' + "Edit" +
        //         //         '</button>&nbsp;' +
        //         //         '<button class="btn btn-danger" ng-click="delete(' + data.id + ')">' +
        //         //         '   <i class="fa fa-trash-o"></i>' + "Delete"
        //         //     '</button>';
        //         // } else {
        //         //     return '<button class="btn btn-primary" ng-click="edit(' + data.id + ')">' +
        //         //         '   <i class="fa fa-eye"></i>' + "View" +
        //         //         '</button>&nbsp;' + '<button class="btn btn-warning" ng-click="update(' + data.id + ')">' +
        //         //         '   <i class="fa fa-clipboard"></i>' + "Clone" +
        //         //         '</button>&nbsp;' +
        //         //         '<button class="btn btn-primary" ng-click="delete(' + data.id + ')">' +
        //         //         '   <i class="fa fa-refresh"></i>' + "Update"
        //         //     '</button>';
        //         // }
        //         // console.log(data);

        //         return '<button class="md-icon-button md-accent md-raised md-hue-2 md-button md-ink-ripple md-default-theme" type="button" ng-transclude="">' +
        //             '<md-icon md-font-icon="icon-pencil-box-outline" ng-click="FetchProductById(' + data.id + ')" class="ng-scope ng-isolate-scope md-font icon-pencil-box-outline material-icons md-default-theme" role="button" aria-hidden="true"></md-icon>' +
        //             '</button>' +
        //             '<button class="md-icon-button md-raised md-warn md-raised md-hue-2 md-button md-ink-ripple md-default-theme" type="button" ng-transclude="">' +
        //             '<md-icon md-font-icon="icon-trash" ng-click="DeleteProductPanel(o)" class="ng-scope ng-isolate-scope md-font icon-trash material-icons md-default-theme" role="button" aria-hidden="true"></md-icon>' +
        //             '</button>';
        //     })
        // ];
        // vm.GetAllMedia = GetAllMedia;
        $scope.checked = {};
        $scope.lstdata = [];

        $scope.GetAllData = function() {
            // vm.dtOptions.ajax.reload();
            $scope.reloadData();
        }

        vm.dtColumns = [
            // DTColumnBuilder.newColumn(null),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(CheckboxHTML),
            DTColumnBuilder.newColumn('id').renderWith(NumberHtml),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
            DTColumnBuilder.newColumn('FileName'),
            DTColumnBuilder.newColumn('Author'),
            DTColumnBuilder.newColumn(null).notSortable()
            .renderWith(actionsHtml)
        ]
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                // dataSrc: "data",
                url: $rootScope.RoutePath + "customer/GetAllMedia",
                // data: {
                //     Name: $scope.Name
                // },
                data: function(d) {
                    d.Name = $scope.Name;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {

                    for (var i = 0; i < json.data.length; i++) {
                        json.data[i].checked = false;
                    };
                    $scope.toggleChecked = false;
                    $scope.lstdata = json.data;
                    return json.data;
                },
            })

        .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(10) // Page size
            .withOption('aaSorting', [1, 'asc'])
            .withOption('createdRow', createdRow);


        // vm.reloadData = reloadData;
        vm.dtInstance = {};

        $scope.reloadData = function() {
            // var resetPaging = false;
            // vm.dtInstance.reloadData(callback, resetPaging);
            // vm.dtInstance.DataTable.reload()
            console.log(vm.dtInstance.DataTable.rows())
        }

        function callback(json) {
            // console.log(json);
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        $scope.toggleSeleted = function() {
            console.log($scope.lstdata);
            console.log($scope.checked)
            $scope.allSelected = !$scope.allSelected;
            angular.forEach($scope.lstdata, function(o) {
                $scope.checked[o.id] = $scope.allSelected;
            });
        };


        function actionsHtml(data, type, full, meta) {

            return '  <md-button class="md-icon-button md-accent md-raised md-hue-2" ng-transclude ng-click="Dhaval2()">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                '</md-button>' +
                '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-transclude ng-click="DeleteBrand(item.id)">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' +
                '</md-button>';


            // return '<md-menu md-offset="0 -7" md-position-mode="target-right target">' +
            //     ' <md-button aria-label="Open demo menu" class="md-icon-button" field-transclude ng-click="$mdOpenMenu($event)">' +
            //     '     <md-icon md-font-icon="icon-dots-horizontal"></md-icon>' +
            //     '  </md-button>' +
            //     '  <md-menu-content width="2">' +
            //     '<md-menu-item>' +
            //     ' <md-button class="md-raised md-primary md-hue-3">' +
            //     '      Detail' +
            //     '   </md-button>' +
            //     '</md-menu-item>' +
            //     ' <md-menu-item>' +
            //     '   <md-button class="md-raised md-primary md-hue-3">' +
            //     '        Invoice' +
            //     '     </md-button>' +
            //     '  </md-menu-item>' +
            //     '   <md-menu-item>' +
            //     '        <md-button class="md-raised md-primary md-hue-3">' +
            //     '             Edit' +
            //     '          </md-button>' +
            //     '       </md-menu-item>' +

            //     '    </md-menu-content>' +
            //     '</md-menu>';
        }

        function ImageHtml(data, type, full, meta) {

            return ' <img src="' + $rootScope.RoutePath + 'MediaUploads/' + data.FileName + '" err-src="assets/images/no-image.png" height="50px" width="50px">';
        }

        function CheckboxHTML(data, type, full, meta) {

            return ' <md-checkbox ng-model="checked[' + data.id + ']" aria-label="Checkbox 1" class="md-primary"></md-checkbox>';
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function Renderdata(data, DT_RowId, full, meta) {
            console.log(data)
        }




        $scope.Dhaval1 = function() {
            // console.log("Test1");
            // Data
            // $http.get("http://localhost:3030/customer/GetAllProductTest").then(function(data) {
            $http.get("http://localhost:3030/product/ExportProducts").then(function(data) {
                console.log(data.data);
                // vm.employees = data.data.rows;
                // $scope.TotalProduct=data.data.count;
            });
        }

        $scope.Dhaval2 = function() {
            // console.log("Test1");
            // Data
            $http.get("http://localhost:3030/customer/GetAllProductTest").then(function(data) {
                console.log(data.data);
                // vm.employees = data.data.rows;
                // $scope.TotalProduct=data.data.count;
            });
        }

        function GetAllMedia() {
            // console.log("Test1");
            // Data
            $http.get("http://localhost:3030/customer/GetAllMedia").then(function(data) {
                console.log(data.data);
                // vm.employees = data.data.rows;
                // $scope.TotalProduct=data.data.count;
            });
        }

        // $scope.Dhaval1();
        // $scope.Dhaval2();

        // $scope.dtInstance = {
        //         "id": "foobar",
        //         "DataTable": oTable,
        //         "dataTable": $oTable
        //             // "reloadData": function(callback, resetPaging),
        //             // "changeData": function(newData),
        //             // "rerender": function()
        //     }
        // $scope.dtOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     // Active Responsive plugin
        //     .withOption('responsive', true);

        // vm.dtOptions = DTOptionBuilder.newOptions()
        //     .withOptions('autoWidth', fnThatReturnsAPromise);


        // function fnThatReturnsAPromise() {
        //     var defer = $q.defer();
        //     defer.resolve(false);
        //     return defer.promise;
        // }



        // vm.dtOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(5)
        //     .withOption('responsive', true)
        //     .withOption('autoWidth', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //     .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // vm.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),
        //     DTColumnDefBuilder.newColumnDef(3),
        //     DTColumnDefBuilder.newColumnDef(4),
        //     DTColumnDefBuilder.newColumnDef(5).notSortable()
        // ];

        // vm.dtOptions = {
        //     dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        //     pagingType: 'simple',
        //     autoWidth: false,
        //     responsive: true
        // };

        // vm.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),

        // ];
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];

        // Methods

        //////////
    }

})();