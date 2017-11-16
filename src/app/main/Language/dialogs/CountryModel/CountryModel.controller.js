(function() {
    'use strict';

    angular
        .module('app.Trackers')
        .controller('CountryModelCtrl', CountryModelCtrl);

    /** @ngInject */
    function CountryModelCtrl($http, $mdDialog, $scope, $rootScope, $mdToast, Id) {

        $scope.init = function() {

            $scope.IdLanguage = Id;
            $scope.model = { Country: false }
            $scope.getAllLangauageInCountry();
            $scope.getAllCountry();
        };
        $scope.getAllLangauageInCountry = function() {
            var params = {
                Id: $scope.IdLanguage
            }
            $http.get($rootScope.RoutePath + "country/getAllLangauageInCountry", { params: params }).then(function(data) {
                $scope.seleCountry = data.data
            });
        }

        $scope.getAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = [];
                var lan = _.filter($scope.seleCountry, { IdLanguage: $scope.IdLanguage })

                for (var i = 0; i < data.data.length; i++) {


                    if (i == 0) {
                        var obj = _.filter($scope.seleCountry, { Country: "All" });
                        var newobj = new Object();
                        newobj.Country = "All";
                        if (obj.length != 0) {
                            data.data[i].IsDisplay = true;
                        } else {
                            data.data[i].IsDisplay = false;
                        }
                        newobj.IsDisplay = data.data[i].IsDisplay;
                        $scope.lstCountry.push(newobj);
                    }

                    var obj = _.filter($scope.seleCountry, { Country: data.data[i].Country });
                    var newobj = new Object();
                    newobj.Country = data.data[i].Country;

                    if (obj.length != 0) {
                        data.data[i].IsDisplay = true;
                    } else {
                        data.data[i].IsDisplay = false;
                    }
                    newobj.IsDisplay = data.data[i].IsDisplay;
                    $scope.lstCountry.push(newobj);
                }

            });
        }
        $scope.DisplaylangCountry = function(o) {

            if (o.IsDisplay == true) {
                var obj = new Object();
                obj.IdLanguage = $scope.IdLanguage;
                obj.Country = o.Country;
                if (obj.Country == 'All') {
                    for (var i = 1; i < $scope.lstCountry.length; i++) {
                        $scope.lstCountry[i].IsDisplay = false;
                    }
                }

                $http.post($rootScope.RoutePath + "country/SaveLagaugeInCountry", obj).then(function(data) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                })
            } else {
                var params = {
                    IdLanguage: $scope.IdLanguage,
                    Country: o.Country,
                }
                $http.get($rootScope.RoutePath + "country/DeleteLagauagefromCountry", { params: params }).then(function(data) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                })
            }
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.init();
    }


})();