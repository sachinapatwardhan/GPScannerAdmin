(function() {
    'use strict';

    angular
        .module('app.LanguageResource')
        .controller('ExportModelController', ExportModelController);

    /** @ngInject */
    function ExportModelController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                Id: '',
                LanguageId: 0,
                Language: '',
                ResourceName: '',
                ResourceValue: '',
            };
            GetAllLanguage();
        }

        function GetAllLanguage() {
            $http.get($rootScope.RoutePath + "language/GetAllLanguage").then(function(data) {
                $scope.lstlanguage = data.data;
                $scope.model.LanguageId = data.data[0].Id;
            });
        }

        $scope.Export = function(o) {
            var objlanguage = _.findWhere($scope.lstlanguage, { Id: parseInt(o.LanguageId) });
            if (objlanguage != null && objlanguage != '' && objlanguage != undefined) {
                window.location = $rootScope.RoutePath + "languageresources/ExportLanguage?languageid=" + o.LanguageId + "&language=" + objlanguage.Name;
            } else {
                window.location = $rootScope.RoutePath + "languageresources/ExportLanguage?languageid=" + o.LanguageId + "&language=Language";
            }
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();
