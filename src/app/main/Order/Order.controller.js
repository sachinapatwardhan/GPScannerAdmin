(function() {
    'use strict';

    angular
        .module('app.order')
        .controller('OrderController', OrderController);

    /** @ngInject */
    function OrderController($http, $scope, $timeout, $compile, $rootScope, $state, $mdToast, $cookieStore, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $window) {

        var vm = this;

        vm.SetOrderTotal = SetOrderTotal;
        vm.GetAllOrderFromModal = GetAllOrderFromModal;

        $scope.init = function() {
            $scope.ShowEditTab = 0;

            $scope.tab = { selectedIndex: 0 };
            $scope.toggleChecked = false;
            $scope.model = {
                StartDate: null,
                EndDate: null,
                // Date: SearchDate,
                SelectedValue: '1'
            };

            $scope.modelInfo = {
                id: '',
                Customer: '',
                CreatedOnUtcdate: null,
                Status: '',
                OrderSubtotalInclTax: null,
                OrderShippingInclTax: null,
                OrderTax: null,
                OrderDiscount: null,
                OrderTotal: null,
                PurchaseOrderNumber: '',
            };

            $scope.modelBillingInfo = {
                id: '',
                FirstName: '',
                LastName: '',
                Address1: '',
                Address2: '',
                CompanyName: '',
                City: '',
                idState: '',
                StateName: '',
                idCountry: 1,
                CountryName: '',
                PostCode: '',
                Email: '',
                PhoneNo: '',
                idUser: '',
            };

            $scope.modelShippingInfo = {
                ShippFirstName: '',
                ShippLastName: '',
                ShippAddress1: '',
                ShippAddress2: '',
                ShippidCountry: null,
                ShippidState: null,
                ShippidCity: '',
                ShippPostCode: '',
                ShippCompanyName: '',
                ShippEmail: '',
                ShippPhoneNo: '',
                idUser: '',
                id: '',
            };


            $scope.GetAllCountry();
            $scope.GetAllCourier();
        }

        //Set Tab
        $scope.SetTab = function(step, id) {
            if (step == 1) {
                $scope.ShowEditTab = 1;
                $scope.objOrder = _.findWhere($scope.lstdata, { id: id });
                $scope.EditOrder($scope.objOrder);
            } else {
                $scope.ShowEditTab = 0;
            }
            $scope.tab = { selectedIndex: step };
        }

        //Show Order Detail Modal 
        $scope.ShowOrderDetailModal = function(ev, id) {
            $scope.objOrder = _.findWhere($scope.lstdata, { id: id });
            $mdDialog.show({
                controller: 'OrderDetailModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Order/dialogs/OrderDetailModal/OrderDetailModal.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objorder: $scope.objOrder,
                    Tasks: [],
                    event: ev,
                    MediaVM: vm
                }
            });
        }

        //Show Edit Order Product Modal 
        $scope.ShowEditOrderProductModal = function(ev, o) {
            $mdDialog.show({
                controller: 'EditOrderProductModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Order/dialogs/EditOrderProductModal/EditOrderProductModal.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objorderProducts: o,
                    Tasks: [],
                    event: ev,
                    ModelInfoVM: vm
                }
            });
        }


        //Show Manage Track Number Modal 
        $scope.ShowTrackNumberModal = function(ev, id) {
            $mdDialog.show({
                controller: 'ManageTrackingNumberModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Order/dialogs/ManageTrackingNumberModal/ManageTrackingNumberModal.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    idorder: id,
                    Tasks: [],
                    event: ev,
                    ModelInfoVM: vm
                }
            });
        }

        function GetAllOrderFromModal(IsUpdate) {

            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Ordertable').dataTable()._fnPageChange(0);

            $('#Ordertable').dataTable()._fnAjaxUpdate();

        }
        //Manage Order Total Form Edit Order Product  modal
        function SetOrderTotal(ordertotal, OrderSubtotalInclTax) {
            $scope.modelInfo.OrderSubtotalInclTax = OrderSubtotalInclTax;
            $scope.modelInfo.OrderTotal = ordertotal;
            $scope.GetAllOrder('', true);
            $scope.GetOrderDetailByOrderId($scope.modelInfo.id);
        }

        //Order detail by id
        $scope.GetOrderDetailByOrderId = function(id) {
            $http.get($scope.RoutePath + 'order/GetOrderDetailByOrderId?idOrder=' + id).then(function(data) {
                if (data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {

                        if (data.data[i].Attribute != '' && data.data[i].AttributeValue != '' && data.data[i].Attribute != null && data.data[i].AttributeValue != null) {
                            var Attribute = data.data[i].Attribute.split(",");
                            var AttributeValue = data.data[i].AttributeValue.split(",");

                            var lstAttribute = [];
                            for (var j = 0; j < Attribute.length; j++) {
                                var obj = new Object();
                                obj["Name"] = Attribute[j];
                                obj["Value"] = AttributeValue[j];

                                lstAttribute.push(obj);
                            }
                            data.data[i]["lstAttribute"] = lstAttribute;
                        }
                    }
                    $scope.lstOrderDetail = data.data;
                } else {
                    $scope.lstOrderDetail = [];
                }
            });
        }

        //get all country
        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(response) {
                $scope.lstCountry = response.data;
            });
        }

        //Get courier
        $scope.GetAllCourier = function() {
            $http.get($rootScope.RoutePath + "courier/GetAllCourier").then(function(response) {
                $scope.CourierList = response.data;
                vm.CourierList = $scope.CourierList;
            });
        }

        //Get State 
        $scope.GetAllStateByCountryShipp = function(id) {
            $scope.modelShippingInfo.ShippidState = '';
            $scope.lstState = '';
            $scope.modelShippingInfo.ShippidCity = '';
            $scope.lstCity = '';
            if (id != null && id != '' && id != undefined) {
                var params = {
                    CountryId: id
                };
                $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(response) {
                    $scope.lstState = response.data;
                });
            }
        }

        //Get City
        $scope.GetAllCityByStateShipp = function(id) {
            //  $scope.modelShippingInfo.ShippidCity = '';
            $scope.lstCity = '';
            if (id != null && id != '' && id != undefined) {
                var params = {
                    StateId: id
                };
                $http.get($rootScope.RoutePath + "city/GetAllCityByStateId", { params: params }).success(function(response) {
                    $scope.lstCity = response.data;
                });
            }
        }

        //Get State 
        $scope.GetAllStateByCountryBill = function(id) {
            $scope.modelBillingInfo.idState = '';
            $scope.lstBillState = '';
            $scope.modelBillingInfo.City = '';
            $scope.lstBillCity = '';
            if (id != null && id != '' && id != undefined) {
                var params = {
                    CountryId: id
                };
                $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(response) {
                    $scope.lstBillState = response.data;
                });
            }
        }

        //Get City
        $scope.GetAllCityByStateBill = function(id) {
            //$scope.modelBillingInfo.City = '';
            $scope.lstBillCity = '';
            if (id != null && id != '' && id != undefined) {
                var params = {
                    StateId: id
                };
                $http.get($rootScope.RoutePath + "city/GetAllCityByStateId", { params: params }).success(function(response) {
                    $scope.lstBillCity = response.data;
                });
            }
        }

        //Edit Order
        $scope.EditOrder = function(o) {
            $scope.modelInfo.id = o.id;
            $scope.modelInfo.Customer = o.tblbillingaddress.FirstName + " " + o.tblbillingaddress.LastName;
            if (o.CreatedOnUtc != null && o.CreatedOnUtc != '' && o.CreatedOnUtc != undefined) {
                $scope.modelInfo.CreatedOnUtcdate = $rootScope.convertdateformat(o.CreatedOnUtc);
            }
            // $scope.modelInfo.CreatedOnUtc = o.CreatedOnUtc;

            $scope.modelInfo.Status = o.tblorderstatus.OrderStatus;
            $scope.modelInfo.OrderSubtotalInclTax = o.OrderSubtotalInclTax;
            $scope.modelInfo.OrderShippingInclTax = o.OrderShippingInclTax;
            $scope.modelInfo.PurchaseOrderNumber = o.PurchaseOrderNumber;
            if (o.OrderTax != null) {
                $scope.modelInfo.OrderTax = o.OrderTax;
            } else {
                $scope.modelInfo.OrderTax = null;
            }
            $scope.modelInfo.OrderTotal = o.OrderTotal;
            $scope.modelInfo.OrderDiscount = o.OrderDiscount;

            //Billing Info
            $scope.modelBillingInfo.id = o.BillingAddressId;
            $scope.modelBillingInfo.FirstName = o.tblbillingaddress.FirstName;
            $scope.modelBillingInfo.LastName = o.tblbillingaddress.LastName;
            $scope.modelBillingInfo.Address1 = o.tblbillingaddress.Address1;
            $scope.modelBillingInfo.Address2 = o.tblbillingaddress.Address2;
            $scope.modelBillingInfo.CompanyName = o.tblbillingaddress.CompanyName;
            $scope.modelBillingInfo.idCountry = o.tblbillingaddress.idCountry;
            $scope.modelBillingInfo.CountryName = o.tblbillingaddress.Country;
            $scope.GetAllStateByCountryBill($scope.modelBillingInfo.idCountry);
            $scope.modelBillingInfo.idState = o.tblbillingaddress.idState;
            $timeout(function() {
                $scope.GetAllCityByStateBill($scope.modelBillingInfo.idState);
            }, 1000);
            $scope.modelBillingInfo.PostCode = o.tblbillingaddress.PostCode;
            $scope.modelBillingInfo.Email = o.tblbillingaddress.Email;
            $scope.modelBillingInfo.idUser = o.tblbillingaddress.CustomerId;
            $scope.modelBillingInfo.City = o.tblbillingaddress.City;
            if (o.tblbillingaddress.PhoneNo != null && o.tblbillingaddress.PhoneNo != '' && o.tblbillingaddress.PhoneNo != undefined) {
                $scope.modelBillingInfo.PhoneNo = parseInt(o.tblbillingaddress.PhoneNo);
            } else {
                $scope.modelBillingInfo.PhoneNo = '';
            }
            //shipping Info
            $scope.modelShippingInfo.id = o.id;
            $scope.modelShippingInfo.ShippFirstName = o.ShippFirstName;
            $scope.modelShippingInfo.ShippLastName = o.ShippLastName;
            $scope.modelShippingInfo.ShippAddress1 = o.ShippAddress1;
            $scope.modelShippingInfo.ShippAddress2 = o.ShippAddress2;
            $scope.modelShippingInfo.ShippidCountry = o.ShippidCountry;
            $scope.modelShippingInfo.ShippCountry = o.ShippCountry;


            $scope.modelShippingInfo.ShippPostCode = o.ShippPostCode;
            $scope.modelShippingInfo.ShippCompanyName = o.ShippCompanyName;
            $scope.modelShippingInfo.ShippEmail = o.tblbillingaddress.Email;
            if (o.tblbillingaddress.PhoneNo != null && o.tblbillingaddress.PhoneNo != '' && o.tblbillingaddress.PhoneNo != undefined) {
                $scope.modelShippingInfo.ShippPhoneNo = parseInt(o.tblbillingaddress.PhoneNo);
            } else {
                $scope.modelShippingInfo.ShippPhoneNo = '';
            }
            $scope.GetAllStateByCountryShipp(o.ShippidCountry);
            $scope.modelShippingInfo.ShippidState = o.ShippidState;
            $timeout(function() {
                $scope.GetAllCityByStateShipp($scope.modelShippingInfo.ShippidState);
                $scope.modelShippingInfo.ShippidCity = o.ShippidCity;
            }, 1000);
            $scope.modelShippingInfo.ShippidState = o.ShippidState;
            $scope.modelShippingInfo.idUser = o.CustomerId;


            //Get Order Detail
            $http.get($scope.RoutePath + 'order/GetOrderDetailByOrderId?idOrder=' + o.id).then(function(data) {
                if (data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {

                        if (data.data[i].Attribute != '' && data.data[i].AttributeValue != '' && data.data[i].Attribute != null && data.data[i].AttributeValue != null) {
                            var Attribute = data.data[i].Attribute.split(",");
                            var AttributeValue = data.data[i].AttributeValue.split(",");

                            var lstAttribute = [];
                            for (var j = 0; j < Attribute.length; j++) {
                                var obj = new Object();
                                obj["Name"] = Attribute[j];
                                obj["Value"] = AttributeValue[j];

                                lstAttribute.push(obj);
                            }
                            data.data[i]["lstAttribute"] = lstAttribute;
                        }
                    }
                    $scope.lstOrderDetail = data.data;
                } else {
                    $scope.lstOrderDetail = [];
                }
            });
        }

        //Update Order From Edit Order Tab
        $scope.UpdateOrder = function(o) {
            $http.post($rootScope.RoutePath + "order/UpdateOrder", o).success(function(response) {
                if (response.success == true) {
                    // message
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllOrder('', true);
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        //Change Order Price
        $scope.setOrderPrice = function() {
            if ($scope.modelInfo.OrderSubtotalInclTax == null) {
                $scope.modelInfo.OrderSubtotalInclTax = 0;
            }
            if ($scope.modelInfo.OrderShippingInclTax == null) {
                $scope.modelInfo.OrderShippingInclTax = 0;
            }
            if ($scope.modelInfo.OrderTax == null) {
                $scope.modelInfo.OrderTax = 0;
            }
            if ($scope.modelInfo.OrderDiscount == null) {
                $scope.modelInfo.OrderDiscount = 0;
            }
            $scope.modelInfo.OrderTotal = parseFloat($scope.modelInfo.OrderSubtotalInclTax) + parseFloat($scope.modelInfo.OrderShippingInclTax) + parseFloat($scope.modelInfo.OrderTax);
            $scope.modelInfo.OrderTotal = $scope.modelInfo.OrderTotal - parseFloat($scope.modelInfo.OrderDiscount);
        }

        //update Billing
        $scope.UpdateBillingInfo = function(o) {
            $http.post($rootScope.RoutePath + "order/UpdateBillingInfo", o).success(function(response) {
                if (response.success == true) {
                    // message
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllOrder('', true);
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        //Update Shipping
        $scope.UpdateShippingInfo = function(o) {

            $http.post($rootScope.RoutePath + "order/UpdateShippingInfo", o).success(function(response) {

                if (response.success == true) {
                    // message
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllOrder('', true);
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        //Update Order Status
        $scope.UpdateOrderStatus = function(Status, idorderStatus, idorder) {
            var params = {
                idOrder: idorder,
                idOrderStatus: idorderStatus,
            }

            var confirm = $mdDialog.confirm()
                .title('Are you sure to ' + Status + ' this Order?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "order/UpdateOrderStatus", { params: params }).success(function(response) {
                    if (response.success == true) {
                        console.log(response);
                        // message
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllOrder(idorderStatus, true);
                    } else {
                        if (response.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(response.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            }, function() {

            });
        }

        //Delete Tracking Number
        $scope.DeleteTrackingNumber = function(orderId) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure to Remove Tracking Number of this Order?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $scope.obj = {
                    OrderId: orderId,
                    TrackingNumber: "",
                    Courier: "",
                    ModifiedDate: new Date(),
                }
                $http.post($rootScope.RoutePath + "order/DeleteTrackingNumber", $scope.obj).success(function(response) {
                    if (response.success == true) {
                        // message
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllOrder($scope.FilterStatus, true);
                    } else {
                        if (response.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(response.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            }, function() {

            });
        }

        //Go Order
        $scope.GoOrder = function() {
            if ($scope.model.SelectedValue == 1) {
                //Print invoice for selected items
                $scope.PrintInvoiceForSelectedOrders();
            }
            if ($scope.model.SelectedValue == 2) {
                //Set to Ready to ship
                $scope.UpdateStatusForSelectedOrders();
            }
            if ($scope.model.SelectedValue == 3) {
                //Print Delivery List
            }
            if ($scope.model.SelectedValue == 4) {
                //Print Tax In voice Report
            }
        }

        //Print invoice for selected items
        $scope.PrintInvoiceForSelectedOrders = function() {
            $scope.ids = [];
            $scope.idsprint = [];

            for (var item in $scope.checked) {
                if ($scope.checked[item] == true) {
                    $scope.ids.push(parseInt(item));
                }
            }

            if ($scope.ids.length == 0) {
                var confirm = $mdDialog.confirm()
                    .title('You must Check atleast one order for Print Invoice')
                    .ok('Ok');
                // .cancel('No');
                $mdDialog.show(confirm).then(function() {}, function() {

                });
                return;
            } else {
                for (var i = 0; i < $scope.ids.length; i++) {
                    var id = $scope.ids[i];
                    var objOrder = _.findWhere($scope.lstdata, { id: id });
                    if (objOrder != null && objOrder != undefined && objOrder != '') {
                        var orderStatus = objOrder.tblorderstatus.OrderStatus;
                        if (orderStatus != "Pending" && orderStatus != "Canceled") {
                            $scope.idsprint.push(id);
                        }
                    }
                }
            }

            if ($scope.idsprint.length == 0) {
                var confirm = $mdDialog.confirm()
                    .title('Selected order\'s status has Pending or Canceled, it will not Print Invoice')
                    .ok('Ok');
                // .cancel('No');
                $mdDialog.show(confirm).then(function() {}, function() {

                });
                return;
            } else {
                window.open($rootScope.RoutePath + "order/InvoiceSelectedOrderReport?OrderId=" + $scope.idsprint, '_blank');
            }

        }

        //Update Status Ready To Shipp of Selected Order
        $scope.UpdateStatusForSelectedOrders = function() {
            $scope.ids = [];

            for (var item in $scope.checked) {
                if ($scope.checked[item] == true) {
                    var obj = new Object();
                    obj["idOrder"] = item;
                    $scope.ids.push(obj);
                }
            }

            if ($scope.ids.length == 0) {
                var confirm = $mdDialog.confirm()
                    .title('You must Check atleast one order for update order status')
                    .ok('Ok');
                // .cancel('No');
                $mdDialog.show(confirm).then(function() {}, function() {

                });
                return;
            }

            $scope.obj = {
                idOrder: $scope.ids,
                idOrderStatus: 2,
            }
            $http.post($rootScope.RoutePath + "order/UpdateOrderStatusWithItem", $scope.obj).success(function(response) {

                if (response.success == true) {
                    // message
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.toggleChecked = false;
                    $scope.toggleSeleted();
                    $scope.GetAllOrder(2, true);
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        //Export Order
        $scope.ExportOrders = function() {
            window.location = $rootScope.RoutePath + "order/ExportOrders";
        }

        //Report
        $scope.InvoiceReport = function(orderId) {
            window.open($rootScope.RoutePath + "order/InvoiceReport?OrderId=" + orderId, '_blank');
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.checked = {};
            $scope.lstdata = [];
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(CheckBoxHtml),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(ButtonHtml),
                    DTColumnBuilder.newColumn('PurchaseOrderNumber').renderWith(PurchaseOrderNumberHtml), ,
                    DTColumnBuilder.newColumn('tblbillingaddress.FirstName').renderWith(),
                    DTColumnBuilder.newColumn('CreatedOnUtc').renderWith(DateFormateHtml),
                    DTColumnBuilder.newColumn('ModifiedDate').renderWith(DateFormateHtml),
                    DTColumnBuilder.newColumn('PaymentMethodSystemName').renderWith(PaymentMethodSystemNameHtml),
                    DTColumnBuilder.newColumn('OrderShippingInclTax').renderWith(CurrencyCode),
                    DTColumnBuilder.newColumn('OrderTotal').renderWith(CurrencyCode),
                    DTColumnBuilder.newColumn('OrderDiscount').renderWith(CurrencyCode),
                    DTColumnBuilder.newColumn('tblorderstatus.OrderStatus'),
                    DTColumnBuilder.newColumn('TrackingNumber').renderWith(TrackingNumberHtml),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
                ]
                // ShowTrackNumberModal
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "order/GetAllOrderByCountry",
                    data: function(d) {
                        d.Status = $scope.FilterStatus;
                        d.StartDate = $scope.model.StartDate;
                        d.EndDate = $scope.model.EndDate;
                        d.UserCountry = $rootScope.UserCountry;
                        d.UserRoles = $rootScope.UserRoles;
                        d.CountryList = $rootScope.CountryList;

                        return d;

                    },

                    type: "get",
                    dataSrc: function(json) {

                        if (json.success != false) {
                            for (var i = 0; i < json.data.length; i++) {

                                json.data[i].checked = false;

                                if (json.data[i].ImageUrl != null && json.data[i].ImageUrl != '' && json.data[i].ImageUrl != undefined) {
                                    var afterDot = json.data[i].ImageUrl.substr(json.data[i].ImageUrl.indexOf('.') + 1);
                                    if (afterDot == 'pdf') {
                                        json.data[i].flgFileType = 'pdf';
                                    } else {
                                        json.data[i].flgFileType = 'img';
                                    }
                                }
                            };
                            $scope.toggleChecked = false;
                            $scope.lstdata = json.data;
                            vm.lstdata = $scope.lstdata;

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
                .withOption('aaSorting', [4, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllOrder = function(idstatus, IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.FilterStatus = idstatus;
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Ordertable').dataTable()._fnPageChange(0);
            $('#Ordertable').dataTable()._fnAjaxUpdate();
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

        $scope.toggleSeleted = function() {
            angular.forEach($scope.lstdata, function(o) {
                $scope.checked[o.id] = $scope.toggleChecked;
                o.checked = $scope.toggleChecked;
            });
        };



        function CurrencyCode(data, type, full, meta) {
            return $rootScope.CurrencyCode + ' ' + data;
        }


        function CheckBoxHtml(data, type, full, meta) {

            return '<md-checkbox ng-transclude  ng-model="checked[' + data.id + ']" aria-label="Checkbox 1" class="md-primary"></md-checkbox>';
        }

        function ButtonHtml(data, type, full, meta) {
            var btn = '<md-menu-item><md-button class="md-primary md-icon-button md-raised" ng-click="ShowOrderDetailModal($event,' + data.id + ')" title="Detail">' +
                '<md-icon md-font-icon="icon-document"></md-icon>' +
                '</md-button>';

            if (full.OrderStatusId != 1 && full.OrderStatusId != 4) {
                btn = btn + '<md-button class="md-accent md-icon-button md-raised" title="Invoice" ng-click="InvoiceReport(' + data.id + ')">' +
                    '   <md-icon md-font-icon="icon-file-document"></md-icon>' +
                    '</md-button>';
            }

            btn = btn + ' <md-button class="md-primary md-icon-button md-raised" ng-if="' + $rootScope.FlgModifiedAccess + '" title="Edit" ng-click="SetTab(1,' + data.id + ')">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                ' </md-button>';

            btn = btn + '</md-menu-item>';

            return btn;
        }

        function PurchaseOrderNumberHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return data;
            } else {
                return full.id;
            }
        }

        function DateFormateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return $rootScope.convertdateformat(data);

            } else {
                return 'N/A';
            }
        }

        function PaymentMethodSystemNameHtml(data, type, full, meta) {

            var btn = data
            if (data == "ATM Payment" || data == 'Direct Bank Transfer') {
                if (full.flgFileType == 'img') {
                    btn = btn + '<br/><md-button class="md-accent md-icon-button md-raised hue-3" ng-click="ShowImage(\'' + full.ImageUrl + '\')" title="View Attachment">' +
                        '   <md-icon md-font-icon="icon-file-image"></md-icon>' +
                        '</md-button>';

                } else if (full.flgFileType == 'pdf') {
                    btn = btn + '<md-button ng-href="' + $rootScope.RoutePath + 'MediaUploads/PaymentReceipt/' + full.ImageUrl + '" target="_blank" class="md-warn md-icon-button md-raised hue-2" title="View Attachment">' +
                        '   <md-icon md-font-icon="icon-document"></md-icon>' +
                        '</md-button>';
                }
            }
            return btn;
        }

        $scope.ShowImage = function(ImageUrl) {
            var alert = $mdDialog.alert({
                template: '<div style="padding:10px;"><h2>Payment Receipt</h2><img ng-src="' + $rootScope.RoutePath + 'MediaUploads/PaymentReceipt/' + ImageUrl + '" /><br/>' +
                    '<div align="right"><md-button id="okbtn" class="md-accent md-raised">' +
                    '  ok' +
                    '</md-button></div>' +
                    '</div>',
            });
            $mdDialog.show(alert).then(function() {});

            $(document).on('click', '#okbtn', function() {
                $mdDialog.hide();
            });

        }

        function TrackingNumberHtml(data, type, full, meta) {
            var btn = "";
            if (full.OrderStatusId == 2) {
                if (data != null && data != undefined && data != '') {
                    btn = btn + '<div><span>Number:<strong>' + full.TrackingNumber + '</strong></span> <br/>' +
                        '<span>Courier:<strong>' + full.Courier + '</strong></span> </div><br/>' +
                        '<div align="center">' +
                        '   <md-button ng-transclude class="md-icon-button md-raised md-accent md-hue-2" title="Edit Tracking Number" ng-click="ShowTrackNumberModal($event,' + full.id + ')">' +
                        '      <i class="icon-pen"></i>' +
                        '   </md-button>' +
                        '   <md-button ng-transclude class="md-icon-button md-raised md-warn" title="Delete Tracking Number" ng-click="DeleteTrackingNumber(' + full.id + ')">' +
                        '       <i class="icon-close"></i>' +
                        '   </md-button>' +
                        '</div>';
                } else {
                    btn = btn + '<div align="center">' +
                        '   <md-button ng-transclude class="md-icon-button  md-raised md-warn md-hue-6" title="Add Tracking Number" ng-click="ShowTrackNumberModal($event,' + full.id + ')">' +
                        '       Add ' +
                        '   </md-button>' +
                        '</div>';
                }
            }

            return btn;
        }

        function actionsHtml(data, type, full, meta) {
            if (data.OrderStatusId != 4 && data.OrderStatusId != 5 && data.OrderStatusId != 6 && data.OrderStatusId != 7) {
                var btn = '<md-menu md-offset="0 -7" md-position-mode="target-right target">' +
                    '<md-button ng-transclude aria-label="Open demo menu" title="Update Status"  class="md-accent md-raised md-icon-button" ng-show="' + $rootScope.FlgModifiedAccess + '" ng-click="$mdOpenMenu($event)">' +
                    '   <md-icon md-font-icon="icon-arrow-down-bold-hexagon-outline"></md-icon>' +
                    '</md-button>' +
                    '<md-menu-content width="3">';

                if (data.OrderStatusId == 1) {
                    btn = btn +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="UpdateOrderStatus(\'Approved\',8,' + data.id + ')">' +
                        '       Approved' +
                        '   </md-button>' +
                        '</md-menu-item>';
                }

                if (data.OrderStatusId == 8) {
                    btn = btn +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="UpdateOrderStatus(\'Ready to Ship\',2,' + data.id + ')">' +
                        '       Ready to Ship' +
                        '   </md-button>' +
                        '</md-menu-item>';
                }

                if (data.OrderStatusId == 2) {
                    btn = btn +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '"  ng-click="UpdateOrderStatus(\'Shipped\',3,' + data.id + ')">' +
                        '       Shipped' +
                        '   </md-button>' +
                        '</md-menu-item>';

                }

                if (data.OrderStatusId == 3) {
                    btn = btn +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '"  ng-click="UpdateOrderStatus(\'Delivered\',5,' + data.id + ')">' +
                        '       Delivered' +
                        '   </md-button>' +
                        '</md-menu-item>' +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="UpdateOrderStatus(\'Delivery failed\',6,' + data.id + ')">' +
                        '       Delivery failed' +
                        '   </md-button>' +
                        '</md-menu-item>' +
                        '<md-menu-item>' +
                        '   <md-button ng-transclude class="md-raised md-primary md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="UpdateOrderStatus(\'Return\',7,' + data.id + ')">' +
                        '       Returned' +
                        '   </md-button>' +
                        '</md-menu-item>';
                }

                if (data.OrderStatusId != 4 && data.OrderStatusId != 5 && data.OrderStatusId != 6 && data.OrderStatusId != 7) {
                    btn = btn +
                        '<md-menu-item >' +
                        '   <md-button ng-transclude class="md-warn md-raised md-hue-3" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="UpdateOrderStatus(\'Cancel\',4,' + data.id + ')">' +
                        '       Canceled' +
                        '   </md-button>' +
                        '</md-menu-item>';
                }

                btn = btn + '</md-menu-content>' +
                    '</md-menu>';

                return btn;
            } else {
                return '';

            }
        };

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
            $scope.SetTab(0)
        }

        $scope.Reset = function() {
            $scope.init();
        }

        $scope.ResetSearch = function() {
            $scope.model = {
                StartDate: null,
                EndDate: null,
                // Date: SearchDate,
                SelectedValue: '1'
            };
            $scope.GetAllOrder(0, true);
        }

        $scope.init();

    }
})();
