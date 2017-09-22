(function() {
    'use strict';

    angular
        .module('app.media')
        .controller('MediaController', MediaController);

    /** @ngInject */
    function MediaController($http, $scope, $rootScope, $compile, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;

        vm.GetAllMedia = GetAllMedia;
        vm.Reset = Reset;
        $scope.init = function() {
            $scope.Search = '';
            $scope.flag = false;
        }

        function Reset() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.resetForm();
            $scope.init();
            $scope.flag = true;
        }

        $scope.resetForm = function() {
            $scope.formMediadetails.$setUntouched();
            $scope.formMediadetails.$setPristine();
        }

        $scope.ResetModel = function() {
            $scope.resetForm();
            $scope.init();
        }

        $scope.gotoMediaList = function() {
            $scope.Search = '';
            $scope.flag = false;
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            GetAllMedia(true);
        }

        function GetAllMedia(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            vm.dtInstance.reloadData(callback, resetPaging);
            $('#Mediatable').dataTable()._fnPageChange(0);
            $('#Mediatable').dataTable()._fnAjaxUpdate();
        }

        $scope.UploadImage = function() {

            var formData = new FormData();
            angular.forEach($scope.Mediafiles, function(obj) {
                formData.append($rootScope.UserName, obj.lfFile);
            });


            $http.post($rootScope.RoutePath + "media/upload", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                $scope.apiMedia.removeAll();
                $scope.init();
                vm.GetAllMedia(true);
            }, function(err) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(err)
                    .position('top right')
                    .hideDelay(3000)
                );
            });
        }

        $scope.UploadImage1 = function() {


            var formData = new FormData();
            angular.forEach($scope.Mediafiles1, function(obj) {
                formData.append('files[]', obj.lfFile);
            });


            $http.post($rootScope.RoutePath + "customer/uploadExcelTest", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(data) {}, function(err) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(err)
                    .position('top right')
                    .hideDelay(3000)
                );
            });
        }

        $scope.DeleteMedia = function(id) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Media?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                var obj = _.findWhere($scope.lstMedia, { id: id });
                $http.get($rootScope.RoutePath + "media/DeleteMedia?idMedia=" + id + "&filename=" + obj.FileName).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        vm.GetAllMedia(true);
                    } else {
                        if (data.data.data == 'TOKEN') {
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }

                    }

                });

            }, function() {

            });

        }

        $scope.OpenModel = function(ev, id) {

            var o = _.findWhere($scope.lstMedia, { id: id });
            $mdDialog.show({
                controller: 'MediaModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Media/dialogs/MediaModel/MediaModel.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objMedia: o,
                    Tasks: [],
                    event: ev,
                    MediaVM: vm
                }
            });
        }

        // console.log($rootScope.state)
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.lstMedia = [];
            vm.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('Author'),
                DTColumnBuilder.newColumn('AltText'),
                DTColumnBuilder.newColumn(null).notSortable()
                .renderWith(actionsHtml)
            ]
            vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "media/GetAllDynamicMedia",
                    type: "get",
                    data: function(d) {
                        if ($scope.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.Search;
                        }
                        return d;
                    },
                    dataSrc: function(json) {
                        $scope.lstMedia = json.data;
                        $scope.lstTotal = json.recordsTotal;
                        return json.data;
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [0, 'asc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });

        // vm.reloadData = reloadData;
        vm.dtInstance = {};

        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">';
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="OpenModel($event,' + data.id + ')" aria-label="Edit Location">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteMedia(' + data.id + ',$event)" aria-label="Add SubLocation">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';
            return btns;
            // return '  <md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-transclude ng-click="OpenModel($event,' + full.id + ')">' +
            //     '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
            //     '</md-button>' +
            //     '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-if="' + $rootScope.FlgDeletedAccess + '" ng-transclude ng-click="DeleteMedia(' + full.id + ')">' +
            //     '<md-icon md-font-icon="icon-trash"></md-icon>' +
            //     '</md-button>';
        }

        function ImageHtml(data, type, full, meta) {
            var filename = data.FileName;
            var extension = filename.substring(filename.lastIndexOf('.') + 1);
            if (extension == 'pdf') {
                return ' <img src= "assets/images/pdf.png" height="50px" width="50px">';
            } else {
                return ' <img src="' + $rootScope.RoutePath + 'MediaUploads/' + data.FileName + '" err-src="assets/images/no-image.png" height="50px" width="50px">';
            }
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }
        $scope.init();
    }

})();