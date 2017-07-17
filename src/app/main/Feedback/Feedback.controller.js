(function() {
    'use strict';

    angular
        .module('app.Feedback')
        .controller('FeedbackController', FeedbackController);

    /** @ngInject */
    function FeedbackController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, $cookieStore, DTColumnBuilder, $compile) {

        var vm = this;

        $scope.init = function() {
            $scope.model = {};

            $scope.GetAllUsers();

            $scope.tab = { selectedIndex: 0 };
        }

        //Retrive User 
        $scope.GetAllUsers = function() {
            $http.get($rootScope.RoutePath + "user/GetAllUser").then(function(data) {
                $scope.lstUsers = data.data;

            });
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                    DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                    DTColumnBuilder.newColumn('ContactPerson'),
                    DTColumnBuilder.newColumn('Email'),
                    DTColumnBuilder.newColumn('Subject'),
                    DTColumnBuilder.newColumn('Enquiry'),

                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
                ]
                // ShowTrackNumberModal
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "petFeedback/GetAllFeedback",
                    // url: $rootScope.RoutePath + "petShop/GetAllPetShop",
                    data: function(d) {
                        // console.log("DATA : ");
                        // console.log(d);
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        // console.log(json);
                        if (json.success != false) {

                            $scope.lstdata = json.data;

                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [0, 'asc'])
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllFeedback = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
        }

        $scope.DeletePetShop = function(id) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Feedback?')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                var o = _.findWhere($scope.lstdata, { id: id });

                $http.get($rootScope.RoutePath + "petFeedback/DeleteFeedback?idFeedBack=" + o.id).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllFeedback(true);
                    } else {
                        if (data.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
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

            }, function() {});
        }


        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function actionsHtml(data, type, full, meta) {
            var btn = '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-if="'+$rootScope.FlgDeletedAccess+'" ng-click="DeletePetShop(' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' +
                '</md-button>';
            btn = btn + '<md-button class="md-raised md-accent md-raised md-hue-1" ng-if="'+$rootScope.FlgAddedEditlocal+'" ng-click="ShowEmailModal($event,' + data.id + ')">' +
                'Replay via Email' + '</md-button>' + '<br/>';
            btn = btn + '';
            return btn;

        };

        //Show Model for Replay Via Email
        $scope.ShowEmailModal = function(ev, id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });
            $mdDialog.show({
                controller: 'FeedbackEmailTemplateModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Feedback/dialogs/EmailTemplateModel/EmailTemplateModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objEmail: $scope.obj,
                    Tasks: [],
                    event: ev,

                }
            })
        }

        //Dynamic Pagging End

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),

        ];

        $scope.dtColumnDefsModal = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        $scope.init();
    }

})();
