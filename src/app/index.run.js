(function() {
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
        //$rootScope.RoutePath = "http://182.70.126.194:10026/";
        // $rootScope.RoutePath = "http://45.64.169.32:4444/";
        // $rootScope.RoutePath = "http://bugzstudio.com:7212/";
        // $rootScope.Socket_URL = "http://bugzstudio.com:7212";
        $rootScope.Socket_URL = "http://localhost:7212";

        // $rootScope.FrontPath = "http://182.70.126.194:10075/";

        // $rootScope.appName = 'Android';
        // var params = {
        //     AppName: $rootScope.appName,
        // }
        // $http.get($rootScope.RoutePath + 'appinfo/GetAppInfoByName', { params: params }).success(function(data) {
        //     $cookieStore.put('appId', data.Id);
        //     $rootScope.appId = data.Id;
        // })

        $rootScope.CurrencyCode = "RM";

        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserCountry = $cookieStore.get('UserCountry');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.CountryList = $cookieStore.get('CountryList');
        if ($rootScope.CountryList == null || $rootScope.CountryList == "" || $rootScope.CountryList == undefined) {
            $rootScope.CountryList = [];
        }
        $rootScope.CheckPageRights = function(ModuleName, callback) {
            $rootScope.FlgAddedAccess = false;
            $rootScope.FlgModifiedAccess = false;
            $rootScope.FlgDeletedAccess = false;

            var params = {
                tablename: ModuleName,
            }

            $http.get($rootScope.RoutePath + "userPermission/CheckRightsbyPage", { params: params }).then(function(data) {
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

        $rootScope.MenuSet = function() {

            var token1 = $cookieStore.get('token');

            // console.log(token1);
            if (token1 != "" && token1 != undefined) {
                var params = {
                    appId: $cookieStore.get('appId'),
                }
                $http.get($rootScope.RoutePath + 'appinfo/GetAppInfoByName', { params: params }).success(function(data) {
                    $cookieStore.put('appName', data.AppName);
                    $rootScope.Added = $cookieStore.get('appId');
                    $rootScope.AppName = data.AppName;
                    $rootScope.appId = data.Id;
                    $rootScope.Logo = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + data.ImageLogo;
                })

                $http.defaults.headers.common['Authorization'] = token1;
                // var params = {
                //     tablename: "Dashboard",
                //     permission: "Show"
                // }

                $http.get($rootScope.RoutePath + "userPermission/GetAllPageRights").then(function(data) {
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
                        var lstDashboard = _.filter(lstAllPages, function(obj) {
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

                        //Menu
                        var lstMenu = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Menu';
                        });

                        if (lstMenu.length > 0) {
                            msNavigationService.saveItem('CMS.menu', {
                                title: 'Menu',
                                state: 'app.menu',
                                order: lstMenu[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Media
                        var lstMedia = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Media';
                        });
                        if (lstMedia.length > 0) {
                            msNavigationService.saveItem('CMS.media', {
                                title: 'Media',
                                state: 'app.media',
                                order: lstMedia[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Banner
                        var lstBanner = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Banner';
                        });
                        if (lstBanner.length > 0) {
                            msNavigationService.saveItem('CMS.Banner', {
                                title: 'Banner',
                                state: 'app.Banner',
                                order: lstBanner[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Language
                        var lstLanguage = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Language';
                        });
                        if (lstLanguage.length > 0) {
                            msNavigationService.saveItem('CMS.Language', {
                                title: 'Language',
                                state: 'app.Language',
                                order: lstLanguage[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Mobile Widget
                        var lstMobileWidget = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Mobile Widget';
                        });
                        if (lstLanguage.length > 0) {
                            msNavigationService.saveItem('CMS.MobileWidget', {
                                title: 'Mobile Widget',
                                state: 'app.MobileWidget',
                                order: lstMobileWidget[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Mobile Language Resources
                        var lstMobileLanguageResource = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Mobile Language Resource';
                        });
                        if (lstMobileLanguageResource.length > 0) {
                            msNavigationService.saveItem('CMS.MobileLanguageResource', {
                                title: 'Mobile Language Resource',
                                state: 'app.MobileLanguageResource',
                                order: lstMobileLanguageResource[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Country-State-City
                        var lstCountryStateCity = _.filter(lstAllPages, function(obj) {
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
                        var lstSetting = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Setting';
                        });
                        if (lstSetting.length > 0) {
                            msNavigationService.saveItem('Settings.Setting', {
                                title: 'Setting',
                                state: 'app.Setting',
                                order: lstSetting[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Module
                        var lstModule = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Manage Module';
                        });
                        if (lstModule.length > 0) {
                            msNavigationService.saveItem('Module.Module', {
                                title: 'Manage Module',
                                state: 'app.Module',
                                order: lstModule[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //Roles
                        var lstRoles = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Roles';
                        });
                        if (lstRoles.length > 0) {
                            msNavigationService.saveItem('Users.roles', {
                                title: 'Roles',
                                state: 'app.roles',
                                order: lstRoles[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        /*//Shopper User
                        var lstuser = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Shopper Users';
                        });
                        if (lstuser.length > 0) {
                            msNavigationService.saveItem('Users.user', {
                                title: 'Shopper Users',
                                state: 'app.user',
                                order: lstuser[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }*/

                        // User Permission
                        var lstUserPermission = _.filter(lstAllPages, function(obj) {
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

                        // Change Password
                        var lstChangePassword = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Change Password';
                        });
                        if (lstUserPermission.length > 0) {
                            msNavigationService.saveItem('Users.ChangePassword', {
                                title: 'Change Password',
                                state: 'app.ChangePassword',
                                order: lstChangePassword[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // Owner User
                        var lstowneruser = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Owner Users';
                        });
                        if (lstowneruser.length > 0) {
                            msNavigationService.saveItem('Users.User', {
                                title: 'Users',
                                state: 'app.owneruser',
                                order: lstowneruser[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        /* // Shopper Customer
                         var lstShopperCustomer = _.filter(lstAllPages, function(obj) {
                             return obj.tblmodulemgmt.Module == 'Shopper Customer';
                         });
                         if (lstShopperCustomer.length > 0) {
                             msNavigationService.saveItem('PBRShop.Shopper Customer', {
                                 title: 'Shopper Customer',
                                 state: 'app.ShopperCustomer',
                                 order: lstShopperCustomer[0].tblmodulemgmt.DisplayOrder,
                                 weight: 1
                             });
                         }

                         // Shopper Vehicle
                         var lstbike = _.filter(lstAllPages, function(obj) {
                             return obj.tblmodulemgmt.Module == 'Shopper Vehicle';
                         });
                         if (lstbike.length > 0) {
                             msNavigationService.saveItem('PBRShop.bike', {
                                 title: 'Shopper Vehicle',
                                 state: 'app.bike',
                                 order: lstbike[0].tblmodulemgmt.DisplayOrder,
                                 weight: 1
                             });
                         }*/

                        // Tracker
                        var lstTrackers = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Trackers';
                        });
                        if (lstTrackers.length > 0) {
                            msNavigationService.saveItem('Trackers', {
                                title: 'Trackers',
                                state: 'app.Trackers',
                                order: lstTrackers[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // var lstTrackers = _.filter(lstAllPages, function(obj) {
                        //     return obj.tblmodulemgmt.Module == 'Trackers';
                        // });
                        // if (lstTrackers.length > 0) {
                        //     msNavigationService.saveItem('Trackers 2', {
                        //         title: 'Trackers 2',
                        //         state: 'app.PetDevice',
                        //         order: lstTrackers[0].tblmodulemgmt.DisplayOrder,
                        //         weight: 1
                        //     });
                        // }


                        // Owner Customer
                        var lstOwnerCustomer = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Owner Customer';
                        });
                        if (lstOwnerCustomer.length > 0) {
                            var MenuName = $rootScope.AppName + '.Customer';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Customer', {
                                title: 'Customer',
                                state: 'app.OwnerCustomer',
                                order: lstOwnerCustomer[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        // Owner Vehicle
                        var lstownerbike = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'Owner Vehicle';
                        });
                        if (lstownerbike.length > 0) {
                            var MenuName = $rootScope.AppName + '.Vehicle';
                            msNavigationService.saveItem(MenuName, {
                                // msNavigationService.saveItem('Maark.Vehicle', {
                                title: 'Vehicle',
                                state: 'app.ownerVehicle',
                                order: lstownerbike[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }

                        //gps
                        var gps = _.filter(lstAllPages, function(obj) {
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
                        var Alarm = _.filter(lstAllPages, function(obj) {
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
                        var CanBusData = _.filter(lstAllPages, function(obj) {
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
                        var DrivingBehaviour = _.filter(lstAllPages, function(obj) {
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
                        var TelephoneCompany = _.filter(lstAllPages, function(obj) {
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

                        //Telephone Company
                        var Logs = _.filter(lstAllPages, function(obj) {
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
                        var AppInfo = _.filter(lstAllPages, function(obj) {
                            return obj.tblmodulemgmt.Module == 'App Info';
                        });
                        if (AppInfo.length > 0) {
                            msNavigationService.saveItem('App Info', {
                                title: 'App Info',
                                state: 'app.appinfo',
                                order: AppInfo[0].tblmodulemgmt.DisplayOrder,
                                weight: 1
                            });
                        }
                    }
                });
            }
        }
        $rootScope.MenuSet();

        //Predefine data
        $rootScope.$on('$stateChangeStart', function(e, to) {
            // $rootScope.CheckPageRights(to);

            $rootScope.Callfuntion = function() {
                $http.get($rootScope.RoutePath + 'currency/GetCurrency').then(function(response) {
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
                var params = {
                    tablename: to.ModuleName,
                    permission: "Show"
                }

                $http.get($rootScope.RoutePath + "userPermission/CheckRights", { params: params }).then(function(data) {
                    if (data.data.success == false) {
                        e.preventDefault();
                        if (window.location.href.indexOf('app/login') == -1 && window.location.href.indexOf('Forgotpassword') == -1 && window.location.href.indexOf('Register') == -1) {
                            //$state.go("app.login");
                            window.location.href = '/#/app/login';
                        }
                    };

                })
            }
            $rootScope.Callfuntion();


        });
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function() {
            $rootScope.loadingProgress = true;

        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function() {
            $timeout(function() {
                delete $http.defaults.headers.common['X-Requested-With'];
                $http.defaults.headers.common['X-Requested-With'] = $state.current.ModuleName;
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function() {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();