(function() {
    'use strict';

    angular
        .module('app.EnquiryMgmt')
        .controller('EnquiryMgmtController', EnquiryMgmtController);


    /** @ngInject */
    function EnquiryMgmtController($http, $scope, $compile, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;
        vm.GetAllEnquiry = GetAllEnquiry;
        $scope.init = function() {
            $scope.model = {
                StartDate: null,
                EndDate: null,
            }
        }

        $scope.ClearDate = function() {
            $scope.model.StartDate = null;
            $scope.model.EndDate = null;
            GetAllEnquiry(true);
        }

        //$scope.SearchEnquirybyDate = function (o) {
        //    console.log(o);
        //    $http.get($rootScope.RoutePath + 'enquiry/GetAllEnquiry?StartDate=' + o.StartDate + '&EndDate=' + o.EndDate + ' &Status=1').then(function (data) {
        //        console.log(data);
        //    });

        //}

        $scope.lstdata = [];
        $scope.dtInstance = {};

        function GetAllEnquiry(IsUpdate) {

            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Enquirytable').dataTable()._fnPageChange(0);
            $('#Enquirytable').dataTable()._fnAjaxUpdate();

        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.dtColumnDefs = [
                DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml),
                DTColumnBuilder.newColumn('Region'),
                DTColumnBuilder.newColumn('Detail').notSortable().renderWith(DetailFieldHtml),
                DTColumnBuilder.newColumn('Message'),
                DTColumnBuilder.newColumn('Status').notSortable().renderWith(StatusButtonHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ButtonHtml)
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "enquiry/GetAllEnquiry",
                    data: function(d) {

                        d.StartDate = $scope.model.StartDate;
                        d.EndDate = $scope.model.EndDate;

                        return d;

                    },

                    type: "get",
                    dataSrc: function(json) {
                        $scope.lstdata = json.data;
                        return json.data;
                    },

                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(5) // Page size
                .withOption('aaSorting', true)
                .withOption('createdRow', createdRow);
            //.withOption('Date', Date);
            // });
        });

        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }

        //function Date() {
        //    //var btn = '<label>' + 'Start Date' + '</label>' + '<input mdc-datetime-picker date="true" time="false" type="text" id="time1" min-date="minDate" format="MM-DD-YYYY" ng-model="model.StartDateUtc" name="StartDateUtc">';
        //    //return btn;
        //}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);

        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function DetailFieldHtml(data, type, full, meta) {
            if (full.CreatedOn != null && full.CreatedOn != undefined && full.CreatedOn != '') {
                var date = $rootScope.convertdateformat(full.CreatedOn);
            } else {
                var date = 'N/A';
            }
            var detailField = '<div><b>Name: </b>' + full.Name + '<br/><b>Email id: </b>' + full.EmailId + '</br><b>Phone: </b>' + full.Phone + '</br><b>Date: </b>' + date + ' </div>'
            return detailField;
        }


        function ButtonHtml(data, type, full, meta) {

            // ng-if="' + $rootScope.FlgAddedEditlocal + '" 
            var btn = '<md-button class="md-raised md-accent md-raised md-hue-1" ng-if="' + $rootScope.FlgModifiedAccess + '"  ng-click="ShowEmailModal($event,' + data.id + ')">' +
                'Replay via Email' + '</md-button>' + '<br/>';
            btn = btn + '<md-button class="md-button md-accent md-raised md-hue-1" ng-click="ShowEnquiryLogModel($event,' + data.id + ')">' +
                'Show Log' + '</md-button>';
            btn = btn + '';
            return btn;
        }

        function StatusButtonHtml(data, type, full, meta) {
            var btn;
            if (data == 0) {
                btn = '<md-button style="background-color:#999">' + 'New' + '</md-button>';
            } else if (data == 1) {
                btn = '<md-button style="background-color:#f0ad4e" ng-if="' + $rootScope.FlgModifiedAccess + '">' + 'In Progress' + '</md-button>';
                btn = btn + '<br/><md-button style="color : rgb(49, 46, 46);background: #78cd51;" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ChangeStatus(' + full.id + ')">' +
                    'Make Complate' + '</md-button> '
            } else {
                btn = '<md-button  style="color : rgb(49, 46, 46);background: #78cd51;">' + 'Complete' + '</md-button>';
            }

            return btn;
        }


        //Show Model for EnquiryLog
        $scope.ShowEnquiryLogModel = function(ev, id) {
            $mdDialog.show({
                controller: 'EnquiryLogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/EnquiryMgmt/dialogs/EnquiryLogModel/EnquiryLogModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objEnquiryLog: id,
                    Tasks: [],
                    event: ev,
                }
            })
        }

        //Show Model for Replay Via Email
        $scope.ShowEmailModal = function(ev, id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });
            $mdDialog.show({
                controller: 'EnquiryEmailTemplateModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/EnquiryMgmt/dialogs/EmailTemplateModel/EmailTemplateModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objEmail: $scope.obj,
                    Tasks: [],
                    event: ev,
                    EmailUpdateVm: vm

                }
            })
        }

        //Update Status for Enquiry
        $scope.ChangeStatus = function(id) {
            var params = {
                idEnquiry: id,
                idEnquiryStatus: 2
            }
            $http.get($rootScope.RoutePath + "Enquiry/UpdateEnquiryStatus", { params: params }).success(function(data) {

                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    GetAllEnquiry(true);
                } else {
                    if (data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        $scope.init();
    }

})();
