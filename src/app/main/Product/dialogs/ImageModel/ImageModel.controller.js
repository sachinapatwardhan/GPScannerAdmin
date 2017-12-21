(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('SelectImageController', SelectImageController);

    /** @ngInject */
    function SelectImageController($http, $rootScope, $mdDialog, $scope, objMedia, Tasks, $compile, event, MediaVM, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;

        vm.GetAllMedia = GetAllMedia;

        // vm.GetAllMedia = GetAllMedia();

        // function GetAllMedia() {
        //     $http.get($rootScope.RoutePath  + "media/GetAllMedia").then(function(data) {
        //         $scope.lstMedia = data.data;
        //     });
        // }
        function GetAllMedia(IsDelete) {

            var resetPaging = false;
            if (IsDelete == true) {
                resetPaging = true;
            };
            vm.dtInstance.reloadData(callback, resetPaging);

            // $http.get($rootScope.RoutePath + "media/GetAllMedia").then(function(data) {
            //     $scope.lstMedia = data.data;

            // });
        }

        $scope.lstMedia = [];
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').renderWith(NumberHtml),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
            DTColumnBuilder.newColumn('Name'),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
        ]
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "media/GetAllDynamicMedia",
                type: "get",
                dataSrc: function(json) {

                    // for (var i = 0; i < json.data.length; i++) {
                    //     json.data[i].checked = false;
                    // };
                    // $scope.toggleChecked = false;
                    $scope.lstMedia = json.data;
                    return json.data;
                },
            })
            // .withOption('rowCallback', rowCallback)
            .withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(10) // Page size
            .withOption('responsive', true)
            .withOption('autoWidth', false)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('createdRow', createdRow);


        // vm.reloadData = reloadData;
        vm.dtInstance = {};

        $scope.reloadData = function() {

        }

        function callback(json) {}

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }




        function actionsHtml(data, type, full, meta) {

            // return '<button id="UpdateButton" class="md-icon-button md-accent md-raised md-hue-2 md-button md-ink-ripple md-default-theme" type="button" ng-transclude="">' +
            //     '<md-icon md-font-icon="icon-pencil-box-outline" ng-click="FetchProductById(' + data.id + ')" class="ng-scope ng-isolate-scope md-font icon-pencil-box-outline material-icons md-default-theme" role="button" aria-hidden="true"></md-icon>' +
            //     '</button>' +
            //     '<button id="DeleteButton" class="md-icon-button md-raised md-warn md-raised md-hue-2 md-button md-ink-ripple md-default-theme" type="button" ng-transclude="">' +
            //     '<md-icon md-font-icon="icon-trash" ng-click="DeleteProductPanel(o)" class="ng-scope ng-isolate-scope md-font icon-trash material-icons md-default-theme" role="button" aria-hidden="true"></md-icon>' +
            //     '</button>';
            return '<md-button class="md-raised md-primary" ng-click="SelectImage(' + full.id + ')">Select</md-button>';


        }

        function ImageHtml(data, type, full, meta) {
            return ' <img src="' + $rootScope.RoutePath + 'MediaUploads/' + data.FileName + '" err-src="assets/images/prod-no-img-new.png" height="50px" width="50px">';
        }
        // var i = 0;

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }


        $scope.SelectImage = function(id) {
            var o = _.findWhere($scope.lstMedia, { id: id });
            MediaVM.SelectImage(o.id, o.FileName);
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();