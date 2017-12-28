(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $http, $cookieStore, msNavigationService, $window) {
        //Predefine data
        var token = $cookieStore.get('token');
        var datatoken = $http.defaults.headers.common['Authorization'];
        if (token != null && token != undefined) {
            if (datatoken == null || datatoken == undefined) {
                $http.defaults.headers.common['Authorization'] = token;
            };
        }
        $rootScope.RoutePath = "http://localhost:7212/";
        $rootScope.Socket_URL = "http://localhost:7212";
        //$rootScope.RoutePath = "http://182.70.126.194:10026/";
        // $rootScope.RoutePath = "http://45.64.169.32:4444/";
        // $rootScope.RoutePath = "http://bugzstudio.com:7212/";
        // $rootScope.Socket_URL = "http://bugzstudio.com:7212";
        // $rootScope.RoutePath = "http://api.maark.my:7212/";
        // $rootScope.Socket_URL = "http://api.maark.my:7212";
        // $rootScope.RoutePath = "http://uatapi.maark.my/";
        // $rootScope.Socket_URL = "http://uatapi.maark.my";

        // $rootScope.FrontPath = "http://182.70.126.194:10075/";
        var x = new Date();
        var offset = -x.getTimezoneOffset();
        $rootScope.CurrentOffset = (('00' + offset).slice(-2) >= 0 ? "+" : "-") + ('00' + parseInt(offset / 60).toString()).slice(-2) + ":" + offset % 60;
        $rootScope.AdminUserId = 1;
        // $rootScope.appName = 'Maark';

        var url = $window.location.protocol + "//" + $window.location.host + "/";

        var params = {
            AdminUrl: url,
        }
        $rootScope.App_name = $rootScope.appName + '-Admin';
        $http.get($rootScope.RoutePath + 'appinfo/GetAppInfoByAdmin', {
            params: params
        }).success(function (data) {

            if (data != null) {
                $rootScope.appId = data.Id;
                $rootScope.AppName = data.AppName;
                $rootScope.Logo = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + data.ImageLogo;
                $rootScope.App_name = data.AppName + '-Admin';
                console.log(data.Id)
                localStorage.setItem('appId', data.Id)
                localStorage.setItem('appName', data.AppName);
                localStorage.setItem('Logo', $rootScope.Logo)

                $cookieStore.put('appId', data.Id);
                $rootScope.MenuSet();
                $('#login-form .logo').css('background-image', 'url(' + $rootScope.Logo + ')');
                $('.logo-image').css('background-image', 'url(' + $rootScope.Logo + ')');
            } else {
                $rootScope.appName = 'Maark'
                var params = {
                    AppName: $rootScope.appName,
                }
                $rootScope.App_name = $rootScope.appName + '-Admin';
                $http.get($rootScope.RoutePath + 'appinfo/GetAppInfoByName', {
                    params: params
                }).success(function (data) {
                    $rootScope.appId = data.Id;
                    $rootScope.AppName = data.AppName;
                    $rootScope.Logo = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + data.ImageLogo;

                    localStorage.setItem('appId', data.Id)
                    localStorage.setItem('appName', data.AppName);
                    localStorage.setItem('Logo', $rootScope.Logo)

                    $cookieStore.put('appId', data.Id);
                    $rootScope.MenuSet();
                    $('#login-form .logo').css('background-image', 'url(' + $rootScope.Logo + ')');
                    $('.logo-image').css('background-image', 'url(' + $rootScope.Logo + ')');
                });
            }
        })

        $rootScope.CurrencyCode = "RM";

        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserCountry = $cookieStore.get('UserCountry');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.CountryList = $cookieStore.get('CountryList');
        if ($rootScope.CountryList == null || $rootScope.CountryList == "" || $rootScope.CountryList == undefined) {
            $rootScope.CountryList = [];
        }

        $http.get('http://api.maark.my:7212/country/GetCurrentCountry').success(function (data) {
            if (data != null) {
                $rootScope.CurrentTimeZone = data.time_zone;
            }
        })
        $rootScope.CheckPageRights = function (ModuleName, callback) {
            $rootScope.UserRoles = $cookieStore.get('UserRoles');
            $rootScope.FlgAddedAccess = false;
            $rootScope.FlgModifiedAccess = false;
            $rootScope.FlgDeletedAccess = false;
            for (var i = 0; i < $rootScope.UserRoles.length; i++) {
                if ($rootScope.UserRoles[i] == 'Super Admin') {
                    var params = {
                        tablename: ModuleName,
                    }
                    break;
                } else {
                    var params = {
                        tablename: ModuleName,
                        idApp: localStorage.getItem('appId'),
                    }
                }
            }
            $http.get($rootScope.RoutePath + "userPermission/CheckRightsbyPage", {
                params: params
            }).then(function (data) {
                if (data.data.success == true) {
                    var objpermission = data.data.data;

                    $rootScope.FlgAddedAccess = objpermission.Added;
                    $rootScope.FlgAddedEditlocal = objpermission.Added;
                    $rootScope.FlgModifiedAccess = objpermission.Modified;
                    $rootScope.FlgDeletedAccess = objpermission.Deleted;
                } else {
                    $rootScope.FlgAddedAccess = false;
                    $rootScope.FlgAddedEditlocal = false;
                    $rootScope.FlgModifiedAccess = false;
                    $rootScope.FlgDeletedAccess = false;
                }
                return callback(1);
            })

            // funAdded();

            // function funAdded() {
            //     var params = {
            //         tablename: ModuleName,
            //         permission: "Added"
            //     }

            //     $http.get($rootScope.RoutePath + "userPermission/CheckRights", { params: params }).then(function(data) {
            //         if (data.data.success == true) {
            //             $rootScope.FlgAddedAccess = true;
            //             $rootScope.FlgAddedEditlocal = true;
            //         } else {
            //             $rootScope.FlgAddedAccess = false;
            //             $rootScope.FlgAddedEditlocal = false;

            //         }
            //         funModified();
            //     })
            // }

            // function funModified() {
            //     var params = {
            //         tablename: ModuleName,
            //         permission: "Modified"
            //     }

            //     $http.get($rootScope.RoutePath + "userPermission/CheckRights", { params: params }).then(function(data) {
            //         if (data.data.success == true) {
            //             $rootScope.FlgModifiedAccess = true;
            //         } else {
            //             $rootScope.FlgModifiedAccess = false;
            //         }
            //         funDeleted();
            //     })
            // }

            // function funDeleted() {
            //     var params = {
            //         tablename: ModuleName,
            //         permission: "Deleted"
            //     }

            //     $http.get($rootScope.RoutePath + "userPermission/CheckRights", { params: params }).then(function(data) {
            //         if (data.data.success == true) {
            //             $rootScope.FlgDeletedAccess = true;
            //         } else {
            //             $rootScope.FlgDeletedAccess = false;
            //         }
            //         return callback(1);
            //     })
            // }

        }

        $rootScope.MenuSet = function () {

            var token1 = $cookieStore.get('token');

            // console.log(token1);
            if (token1 != "" && token1 != undefined) {
                // var params = {
                //     appId: $cookieStore.get('appId'),
                // }
                // $http.get($rootScope.RoutePath + 'appinfo/GetAppInfoByName', { params: params }).success(function(data) {
                //     $cookieStore.put('appName', data.AppName);
                //     $rootScope.Added = $cookieStore.get('appId');
                //     $rootScope.AppName = data.AppName;
                //     $rootScope.appId = data.Id;
                //     $rootScope.Logo = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + data.ImageLogo;
                // })
                // msNavigationService.clearNavigation();
                $http.defaults.headers.common['Authorization'] = token1;
                // var params = {
                //     tablename: "Dashboard",
                //     permission: "Show"
                // }
                $rootScope.UserRoles = $cookieStore.get('UserRoles');
                for (var i = 0; i < $rootScope.UserRoles.length; i++) {
                    if ($rootScope.UserRoles[i] == 'Super Admin') {
                        var params = {
                            idApp: '',
                        }
                        break;
                    } else {
                        var params = {
                            idApp: localStorage.getItem('appId'),
                        }
                    }
                }

                $http.get($rootScope.RoutePath + "userPermission/GetAllPageRights", {
                    params: params
                }).then(function (data) {
                    if (data.data.success == true) {
                        var lstAllPages = data.data.data;
                        // msNavigationService.clearNavigation();
                        // msNavigationService.saveItem('Dashboard', {
                        //     title: 'Dashboard',
                        //     state: 'app.Dashboard',
                        //     order: data.data.order,
                        //     weight: 1
                        // });

                        //Dashboard
                        var lstDashboard = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Dashboard';
                        });
                        if (lstDashboard.length > 0) {
                            msNavigationService.saveItem('Dashboard', {
                                title: 'Dashboard',
                                state: 'app.Dashboard',
                                // icon: 'icon-lock',
                                order: lstDashboard[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Country-State-City
                        var lstCountryStateCity = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Country-State-City';
                        });
                        if (lstCountryStateCity.length > 0) {
                            msNavigationService.saveItem('Settings.Country-State-City', {
                                title: 'Country-State-City',
                                state: 'app.City',
                                order: lstCountryStateCity[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Setting
                        var lstSetting = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'App Setting';
                        });
                        if (lstSetting.length > 0) {
                            msNavigationService.saveItem('CMS.App Setting', {
                                title: 'App Setting',
                                state: 'app.Setting',
                                order: lstSetting[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }



                        //Roles
                        var lstRoles = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Roles';
                        });
                        if (lstRoles.length > 0) {
                            msNavigationService.saveItem('Users.Roles', {
                                title: 'Roles',
                                state: 'app.roles',
                                order: lstRoles[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }


                        // User Permission
                        var lstUserPermission = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'User Permission';
                        });
                        if (lstUserPermission.length > 0) {
                            msNavigationService.saveItem('Users.UserPermission', {
                                title: 'User Permission',
                                state: 'app.UserPermission',
                                order: lstUserPermission[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //  User
                        var lstuser = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Users';
                        });
                        if (lstuser.length > 0) {
                            msNavigationService.saveItem('Users.Users', {
                                title: 'Users',
                                state: 'app.user',
                                order: lstuser[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }


                        // Tracker
                        var lstTrackers = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Trackers';
                        });
                        if (lstTrackers.length > 0) {
                            msNavigationService.saveItem('Settings.Trackers', {
                                title: 'Trackers',
                                state: 'app.Trackers',
                                order: lstTrackers[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //  Customer
                        var lstCustomer = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Customer';
                        });
                        if (lstCustomer.length > 0) {
                            var MenuName = $rootScope.AppName + '.Customer';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Customer', {
                                title: 'Customer',
                                state: 'app.Customer',
                                order: lstCustomer[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //  Vehicle
                        var lstVehicle = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Vehicle';
                        });
                        if (lstVehicle.length > 0) {
                            var MenuName = $rootScope.AppName + '.Vehicle';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Vehicle', {
                                title: 'Vehicle',
                                state: 'app.Vehicle',
                                order: lstVehicle[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //gps
                        var gps = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Gps';
                        });
                        if (gps.length > 0) {
                            var MenuName = $rootScope.AppName + '.Gps';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Gps', {
                                title: 'Gps',
                                state: 'app.gps',
                                order: gps[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }
                        //Alarm
                        var Alarm = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Alarm';
                        });
                        if (Alarm.length > 0) {
                            var MenuName = $rootScope.AppName + '.Alarm';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Alarm', {
                                title: 'Alarm',
                                state: 'app.alarm',
                                order: Alarm[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //CanBusData
                        var CanBusData = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'CanBus Data';
                        });
                        if (CanBusData.length > 0) {
                            var MenuName = $rootScope.AppName + '.CanBus';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.CanBus', {
                                title: 'CanBus',
                                state: 'app.CanBusData',
                                order: CanBusData[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //DrivingBehavior
                        var DrivingBehaviour = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Driving Behaviour';
                        });
                        if (DrivingBehaviour.length > 0) {
                            var MenuName = $rootScope.AppName + '.Driving Behaviour';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Driving Behaviour', {
                                title: 'Driving Behaviour',
                                state: 'app.DrivingBehaviour',
                                order: DrivingBehaviour[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Telephone Company
                        var TelephoneCompany = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Telephone Company';
                        });
                        if (TelephoneCompany.length > 0) {
                            msNavigationService.saveItem('CMS.Telephone Company', {
                                title: 'Telephone Company',
                                state: 'app.telco',
                                order: TelephoneCompany[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // // Logs
                        var Logs = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Logs';
                        });
                        if (Logs.length > 0) {
                            var MenuName = $rootScope.AppName + '.Logs';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Logs', {
                                title: 'Logs',
                                state: 'app.Logs',
                                order: Logs[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //App Info
                        var AppInfo = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'App Info';
                        });
                        if (AppInfo.length > 0) {
                            msNavigationService.saveItem('CMS.App Info', {
                                title: 'App Info',
                                state: 'app.appinfo',
                                order: AppInfo[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //SIM
                        var SIM = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'SIM';
                        });
                        if (SIM.length > 0) {
                            msNavigationService.saveItem('Settings.SIM', {
                                title: 'SIM',
                                state: 'app.SIM',
                                order: SIM[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        var lstUtility = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Utility';
                        });
                        if (lstUtility.length > 0) {
                            msNavigationService.saveItem('Settings.Utility', {
                                title: 'Utility',
                                state: 'app.Utility',
                                order: lstUtility[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        var lstTransferDevice = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Transfer Device';
                        });
                        if (lstTransferDevice.length > 0) {
                            msNavigationService.saveItem('Settings.Transfer Device', {
                                title: 'Transfer Device',
                                state: 'app.TransferDevice',
                                order: lstTransferDevice[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // Assign Device to Agent
                        var lstAssignDevice = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Assign Device';
                        });
                        if (lstAssignDevice.length > 0) {
                            msNavigationService.saveItem('Settings.Assign Device', {
                                title: 'Assign Device',
                                state: 'app.AssignDevice',
                                order: lstAssignDevice[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //VehicleType
                        var lstVehicleType = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Vehicle Type';
                        });
                        if (lstVehicleType.length > 0) {
                            var MenuName = $rootScope.AppName + '.Vehicle Type';
                            msNavigationService.saveItem(MenuName, {
                                title: 'Vehicle Type',
                                state: 'app.VehicleType',
                                order: lstVehicleType[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }
                        //Language
                        var lstLanguage = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Language';
                        });
                        if (lstLanguage.length > 0) {
                            // var MenuName = $rootScope.AppName + ;
                            msNavigationService.saveItem('CMS.Language', {
                                title: 'Language',
                                state: 'app.Language',
                                order: lstLanguage[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // //LanguageResource
                        // var lstLanguageResource = _.filter(lstAllPages, function(obj) {
                        //     return obj.tblmodulemgmt.Module == 'Language Resource';
                        // });
                        // if (lstLanguageResource.length > 0) {
                        //     // var MenuName = $rootScope.AppName + ;
                        //     msNavigationService.saveItem('Users.Language Resource', {
                        //         title: 'Language Resource',
                        //         state: 'app.LanguageResource',
                        //         order: lstLanguageResource[0].tblmodulemgmt.DisplayOrder,
                        //         weight: 1
                        //     });
                        // }

                        //MobileLanguageResource
                        var lstMobileLanguageResource = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Mobile Language Resource';
                        });
                        if (lstMobileLanguageResource.length > 0) {
                            // var MenuName = $rootScope.AppName + ;
                            msNavigationService.saveItem('CMS.Mobile Language Resource', {
                                title: 'Mobile Language Resource',
                                state: 'app.MobileLanguageResource',
                                order: lstMobileLanguageResource[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //VehicleLastUse
                        var lstVehicleLastUse = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Vehicle Last Use';
                        });
                        if (lstVehicleLastUse.length > 0) {
                            var MenuName = $rootScope.AppName + '.Vehicle Last Use';
                            msNavigationService.saveItem(MenuName, {
                                title: 'Vehicle Last Use',
                                state: 'app.VehicleLastUse',
                                order: lstVehicleLastUse[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //ServiceType
                        var lstServiceType = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Service Type';
                        });
                        if (lstServiceType.length > 0) {
                            msNavigationService.saveItem('CMS.Service Type', {
                                title: 'Service Type',
                                state: 'app.ServiceType',
                                order: lstServiceType[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        if ($rootScope.AdminUserId == $cookieStore.get('UserId')) {
                            msNavigationService.saveItem('Users.Manage Module', {
                                title: 'Manage Module',
                                state: 'app.Module',
                                // order: lstModule[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });

                            msNavigationService.saveItem('Users.Setting', {
                                title: 'Setting',
                                state: 'app.MainSetting',
                                // order: lstVehicleType[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });

                        }


                        //Attribute
                        var lstAttributes = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Attribute';
                        });
                        if (lstAttributes.length > 0) {
                            msNavigationService.saveItem('CMS.Attribute', {
                                title: 'Attribute',
                                state: 'app.attribute',
                                order: lstAttributes[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Product
                        var lstProducts = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Products';
                        });
                        if (lstProducts.length > 0) {
                            msNavigationService.saveItem('Order Services.Product', {
                                title: 'Product',
                                state: 'app.product',
                                order: lstProducts[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Order Service
                        var lstoservice = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Order Service';
                        });
                        if (lstoservice.length > 0) {
                            msNavigationService.saveItem('Order Services.Order Service', {
                                title: 'Order Service',
                                state: 'app.orderservice',
                                order: lstoservice[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }


                        var lstWalletTransation = _.filter(lstAllPages, function (obj) {
                            return obj.tblmodulemgmt.Module == 'Manage Wallet';
                        });
                        if (lstWalletTransation.length > 0) {
                            //Wallet Transation
                            var lstWalletTransation = _.filter(lstAllPages, function (obj) {
                                return obj.tblmodulemgmt.Module == 'Wallet Transaction';
                            });
                            if (lstWalletTransation.length > 0) {
                                msNavigationService.saveItem('Wallet.Wallet Transaction', {
                                    title: 'Wallet Transaction',
                                    state: 'app.WalletTransaction',
                                    order: lstWalletTransation[0].tblmodulemgmt.DisplayOrder,
                                    weight: 1
                                });
                            }
                            //Wallet Transation
                            var lstWallet = _.filter(lstAllPages, function (obj) {
                                return obj.tblmodulemgmt.Module == 'Wallet';
                            });
                            if (lstWallet.length > 0) {
                                msNavigationService.saveItem('Wallet.Wallet', {
                                    title: 'Wallet',
                                    state: 'app.wallet',
                                    order: lstWallet[0].tblmodulemgmt.DisplayOrder,
                                    weight: 1
                                });
                            }
                        }

                    }
                });
            }
        }
        // $rootScope.MenuSet();

        //Predefine data
        $rootScope.$on('$stateChangeStart', function (e, to) {
            // $rootScope.CheckPageRights(to);

            $rootScope.Callfuntion = function () {
                $http.get($rootScope.RoutePath + 'currency/GetCurrency').then(function (response) {
                    if (response.data != null) {
                        $rootScope.CurrencyCode = response.data.CurrencyCode;
                    } else {
                        $rootScope.CurrencyCode = "RM";
                    }
                });


                //check User Login
                $rootScope.UserName = $cookieStore.get('UserName');
                if ($rootScope.UserName == null || $rootScope.UserName == undefined) {
                    if (window.location.href.indexOf('app/login') == -1 && window.location.href.indexOf('Forgotpassword') == -1 && window.location.href.indexOf('Register') == -1) {
                        //$state.go("app.login");
                        window.location.href = '/#/app/login';
                    }
                }

                //check Permission
                $rootScope.UserRoles = $cookieStore.get('UserRoles');
                if (to.ModuleName != 'Setting' && to.ModuleName != 'Manage Module') {


                    if ($rootScope.UserRoles) {
                        for (var i = 0; i < $rootScope.UserRoles.length; i++) {
                            if ($rootScope.UserRoles[i] == 'Super Admin') {

                                var params = {
                                    tablename: to.ModuleName,
                                    permission: "Show"
                                }
                                break;
                            } else {
                                var params = {
                                    tablename: to.ModuleName,
                                    permission: "Show",
                                    idApp: localStorage.getItem('appId'),
                                }
                            }
                        }
                        $http.get($rootScope.RoutePath + "userPermission/CheckRights", {
                            params: params
                        }).then(function (data) {
                            if (data.data.success == false) {
                                e.preventDefault();
                                if (window.location.href.indexOf('app/login') == -1 && window.location.href.indexOf('Forgotpassword') == -1 && window.location.href.indexOf('Register') == -1) {
                                    //$state.go("app.login");
                                    window.location.href = '/#/app/login';
                                }
                            };

                        })
                    }
                }
            }
            $rootScope.Callfuntion();


        });
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;

        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                delete $http.defaults.headers.common['X-Requested-With'];
                $http.defaults.headers.common['X-Requested-With'] = $state.current.ModuleName;
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();