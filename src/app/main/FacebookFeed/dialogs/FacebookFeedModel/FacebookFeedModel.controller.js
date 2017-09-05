(function() {
    'use strict';

    angular
        .module('app.FacebookFeed')
        .controller('FacebookFeedModelController', FacebookFeedModelController);

    /** @ngInject */
    function FacebookFeedModelController($http, $mdDialog, $mdToast, $scope, $rootScope, CountryList, event, FacebookFeedVM, FacebookCountry) {
        var vm = this;
        vm.FlgAddedEditlocal = FacebookFeedVM.FlgAddedEditlocal
        $scope.init = function() {
            $scope.model = {
                Country: 'All',
            };
            // GetAllLanguage();
        }

        $scope.lstCountry = CountryList;

        $scope.SaveCountry = function(country) {
            var IsCountryExist = false;
            if (FacebookCountry != "") {
                var lstCountryData = FacebookCountry.split(',');


                var objCountry = _.find(lstCountryData, function(item) {
                    return item == country;
                })


                if (objCountry) {
                    IsCountryExist = true;
                };
            };
            if (!IsCountryExist) {

                var Value = "";
                // console.log(FacebookCountry)
                if (FacebookCountry == "") {
                    Value = country;
                    FacebookCountry = Value;
                } else {
                    Value = FacebookCountry + "," + country;
                    FacebookCountry = Value;
                }
                // console.log()

                var obj = {
                    Name: "PushFacebookCountrySetting",
                    Value: FacebookCountry
                }

                $http.post($rootScope.RoutePath + "settings/UpdateTaxSettingByName", obj).then(function(response) {

                    if (response.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country Added Successfully.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                        FacebookFeedVM.GetAllFacebookCountrySettings();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country could Added.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Country already Exist.")
                    .position('top right')
                    .hideDelay(3000)
                );
            }
        }


        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.Reset = function() {

        }
        $scope.init();
    }
})();