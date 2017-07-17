(function() {
    'use strict';

    angular
        .module('app.ownerbike')
        .controller('OwnerBikeController', OwnerBikeController);

    /** @ngInject */
    function OwnerBikeController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $cookieStore, $compile) {
        var vm = this;

        var socket = io($rootScope.Socket_URL);
        socket.on('BikeDeviceStatus', function(msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function() {
                for (var i = 0; i < $scope.lstdata.length; i++) {
                    if ($scope.lstdata[i].id == obj.PetId) {
                        $scope.lstdata[i].IsOnline = obj.Status;
                        $scope.GetAllBike();
                    }
                }
            });
        });

        var pendingSearch = angular.noop;
        $scope.flgValidation = true;
        $scope.init = function() {
            var date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

            $scope.model = {
                id: 0,
                iduser: 0,
                bikeimageURl: '',
                bikeNumber: '',
                microchipped: 0,
                nameplate: 0,
                deviceid: '',
                renewaldate: new Date(date),
                macname: '',
                mode: 0,
                DeviceBattery: 0,
                IsDeleted: 0,
                IsCharging: 0,
                IMEINumber: '',
                CurrentWifi: '',
                DeviceModel: '',
                IsOnline: 0,
                Weight: '',
                DeviceType: '',
                IsOldDevice: 0,
                Gsercer: 0,
                Buyer: '',
                country: '',

            };

            $scope.modelSearch = {
                country: '',
            }

            $scope.selectedItem = null;
            $scope.renewalflg = 0;

            $scope.objSelectedUser = [];
            $scope.GetAllCountry();

            $scope.tab = { selectedIndex: 0 };
            $scope.FlgImage = 0;
            $scope.FlgCropImage = 0;

        }


        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.GetUserByName = function(query) {

            $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }
        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function(q) {
            if (q != null && q != undefined) {
                $scope.model.iduser = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.iduser = '';
                $scope.flgErrorNotFound = 1;
            };
        }



        $scope.DeleteBike = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Vehicle?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "bike/DeleteBike?DeviceId=" + id).then(function(data) {

                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllBike(true);
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
        $scope.renewaldate = function() {
            if ($scope.model.DeviceType == "Z3") {
                $scope.renewalflg = 1;
            } else {
                $scope.renewalflg = 0;
            }
        }
        $scope.FetchBikeById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstdata, { id: id });

            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.iduser = o.iduser;
            $scope.model.bikeimageURl = o.bikeimageURl;

            $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/PetUpload/' + $scope.model.bikeimageURl;

            if ($scope.model.bikeimageURl != null && $scope.model.bikeimageURl != '' && $scope.model.bikeimageURl != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }

            $scope.model.bikeNumber = o.bikeNumber;
            $scope.model.microchipped = o.microchipped;
            $scope.model.nameplate = o.nameplate;
            $scope.model.deviceid = o.deviceid;
            $scope.model.renewaldate = new Date(o.renewaldate);
            $scope.model.macname = o.macname;
            $scope.model.DeviceBattery = o.DeviceBattery;
            $scope.model.mode = o.mode;
            $scope.model.IsCharging = o.IsCharging;
            $scope.model.IsDeleted = o.IsDeleted;
            $scope.model.IMEINumber = o.IMEINumber;
            $scope.model.CurrentWifi = o.CurrentWifi;
            $scope.model.DeviceModel = o.DeviceModel;
            $scope.model.IsOnline = o.IsOnline;
            $scope.model.IsOldDevice = o.IsOldDevice;
            $scope.model.Weight = o.Weight;

            $scope.model.DeviceType = o.DeviceType;
            if ($scope.model.DeviceType == "Z3") {
                $scope.renewalflg = 1;
            } else {
                $scope.renewalflg = 0;
            }

            $scope.selectedItem = o.tbluserinformation;
            $scope.model.Gsercer = o.Gsercer;
            $scope.model.Buyer = o.Buyer;

            $scope.model.country = o.tbluserinformation.country;

        }

        $scope.CreateBike = function(o) {
            $http.post($rootScope.RoutePath + "bike/SaveBike", o).then(function(data) {
                if (data.data.success == true) {
                    var id;
                    if (o.id != 0) {
                        id = o.id;
                    } else {
                        id = data.data.data.id;
                    }
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true;
                    }
                    $scope.GetAllBike(true);
                    $scope.init();
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
                    };

                }
            });
        };
        //location model
        $scope.ShowModal = function(ev, device, bikeNumber, images, IsOnline) {
            $mdDialog.show({
                controller: 'Location1Controller',
                controllerAs: 'vm',
                templateUrl: 'app/main/OwnerBike/dialogs/Location/Location.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    deviceid: device,
                    bikeNumber: bikeNumber,
                    images: images,
                    Tasks: [],
                    event: ev,
                    MediaVM: vm,
                    IsOnline: IsOnline,
                }
            });
        }

        $scope.closeModal = function() {
            $mdDialog.hide();
        };

        //end model

        //Dynamic Pagging       
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('bikeNumber'),
                DTColumnBuilder.newColumn('tbluserinformation.username'),
                DTColumnBuilder.newColumn('tbluserinformation.country'),
                DTColumnBuilder.newColumn('deviceid').renderWith(DeviceIdHtml),
                DTColumnBuilder.newColumn('IsOnline').notSortable().renderWith(StatusHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]

            // ShowTrackNumberModal       
            $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "bike/GetAllBikebyCountry",
                    data: function(d) {
                        d.UserCountry = $rootScope.UserCountry;
                        if ($scope.modelSearch.country != null && $scope.modelSearch.country != "") {
                            var UserRolesList = []
                            for (var i = 0; i < $rootScope.UserRoles.length; i++) {
                                if ($rootScope.UserRoles[i] != 'Super Admin') {
                                    var obj = new Object();
                                    obj = $rootScope.UserRoles[i];
                                    UserRolesList.push(obj);
                                }
                            }
                            d.UserRoles = UserRolesList;
                            var obj = new Object();
                            var CountryList = []
                            obj = $scope.modelSearch.country;
                            CountryList.push(obj);
                            d.CountryList = CountryList;
                            d.DeviceType = "M2-U";
                        } else {
                            d.UserRoles = $rootScope.UserRoles;
                            d.CountryList = $rootScope.CountryList;
                            d.DeviceType = "M2-U";
                        }

                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.data.length > 0) {
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
                .withOption('aaSorting', [0, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance1 = {};


        //Reload Datatable
        $scope.GetAllBike = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance1.reloadData(callback, resetPaging);
            $('#OwnerBiketable').dataTable()._fnPageChange(0);
            $('#OwnerBiketable').dataTable()._fnAjaxUpdate();

        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function IsOldDeviceHtml(data, type, full, meta) {
            var str = '';
            if (data == true) {
                str = '<span  style="font-size: 20px;color: green"> &#x2714;</span>';
            } else {
                str = '<span style="font-size: 20px;color: red">&#x2716;</span>';
            }
            return str;
        }

        function actionsHtml(data, type, full, meta) {
            var device = data.deviceid;
            var event = '$event';
            var btns = '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="FetchBikeById(' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                '</md-button>' +
                '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-if="' + $rootScope.FlgDeletedAccess + '" ng-click="DeleteBike(\'' + device + '\')" aria-label="">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' +
                '</md-button>' +
                ' <md-button class="md-icon-button md-accent md-raised  md-hue-2" ng-click="ShowModal($event,\'' + device + '\',\'' + data.bikeNumber + '\',\'' + data.bikeimageURl + '\',\'' + data.IsOnline + '\')">' +
                '<md-icon md-font-icon="icon-map-marker"></md-icon>' +
                '</md-button>' +
                '<md-button class="md-icon-button md-accent md-raised  md-hue-2" ng-click="ShowAlarmDetail($event,\'' + device + '\')">' +
                '<md-icon md-font-icon="icon-timer"></md-icon>' +
                '</md-button>';

            return btns;
        };

        function ImageHtml(data, type, full, meta) {
            var img = '';
            if (full.bikeimageURl != "") {
                img = '<img ng-src="' + $rootScope.RoutePath + 'MediaUploads/PetUpload/' + full.bikeimageURl + '" err-src="assets/images/no-image.png" height="50px" width="50px">';

            } else {
                img = '<img ng-src="assets/images/no-image.png" height="50px" width="50px">';
            }
            return img;
        }

        function ModeHtml(data, type, full, meta) {
            var span = '';
            if (full.mode == '1') {
                span = '<span>Tracking</span>';

            } else {
                span = '<span>Sleep</span>';
            }
            return span;
        }

        function UserCountryHTML(data, type, full, meta) {
            var country = '';
            if (data.tbluserinformation.country != '' && data.tbluserinformation.country != null) {
                country = data.tbluserinformation.country;
            } else {
                country = "N/A";
            }
            return country;
        }

        function DeviceIdHtml(data, type, full, meta) {
            if (data != null && data != '') {
                return data;
            } else {
                return "N/A";
            }

        }

        function StatusHtml(data, type, full, meta) {
            var str = '';
            if (data == true) {
                str = '<span  style="font-size: 20px;color: green"> &#x2714;</span>';
            } else {
                str = '<span style="font-size: 20px;color: red">&#x2716;</span>';
            }
            return str;
        }


        //Dynamic Pagging End

        //show Alarm Detail
        $scope.ShowAlarmDetail = function(ev, id) {
            $scope.obj = _.findWhere($scope.lstdata, { deviceid: id });
            $mdDialog.show({
                controller: 'AlarmDetail1Controller',
                controllerAs: 'vm',
                templateUrl: 'app/main/OwnerBike/dialogs/AlarmDetail/AlarmDetail.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objUser: $scope.obj,
                    Tasks: [],
                    event: ev,

                }
            })
        }


        $scope.ResetEdit = function() {
            $scope.FormManageBike.$setPristine();
            $scope.FormManageBike.$setUntouched();
            var date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            $scope.model = {

                id: 0,
                iduser: 0,
                bikeimageURl: '',
                bikeNumber: '',
                microchipped: 0,
                nameplate: 0,
                deviceid: '',
                renewaldate: new Date(date),
                macname: '',
                mode: true,
                DeviceBattery: 0,
                IsDeleted: 0,
                IsCharging: 0,
                IMEINumber: '',
                CurrentWifi: '',
                DeviceModel: '',
                IsOnline: 0,
                HandshakDatetime: '',
                CreatedDate: new Date(),
                Weight: '',
                DeviceType: '',
                IsOldDevice: 0,
                Gsercer: 0,
                Buyer: '',
            };

            $scope.modelSearch = {
                country: '',
            }

            $scope.FlgImage = 0;
            $scope.FlgCropImage = 0;
            $scope.myImage = '';
            $scope.myCroppedImage = '';
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }

            $scope.myImage = '';
            $scope.myCroppedImage = '';
            $scope.init();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }

        $scope.Test = function() {}

        $scope.init();

    }

})();