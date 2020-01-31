(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, DTOptionsBuilder, $cookieStore, $http, $window) {

        // $rootScope.RoutePath = "http://localhost:3030/";
        //////////
        $rootScope.editorOptions = {
            language: 'en',
            extraPlugins: 'colorbutton'
            // uiColor: '#000000'
        };


        $rootScope.convertdateformat = function (date1, flg) {
            var date = new Date(date1);
            var firstdayDay = date.getDate();
            var firstdayMonth = date.getMonth() + 1;
            var firstdayYear = date.getFullYear();
            var firstdayHours = date.getHours();
            var firstdayMinutes = date.getMinutes();
            var firstdaySeconds = date.getSeconds();
            var ampm = firstdayHours >= 12 ? 'pm' : 'am';
            if (flg == 1) {
                return ("00" + firstdayDay.toString()).slice(-2) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("0000" + firstdayYear.toString()).slice(-4) + ' ' + ("00" + firstdayHours.toString()).slice(-2) + ":" + ("00" + firstdayMinutes.toString()).slice(-2) + ":" + ("00" + firstdaySeconds.toString()).slice(-2);
            }
            if (flg == 2) {
                return ("00" + firstdayDay.toString()).slice(-2) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("0000" + firstdayYear.toString()).slice(-4) + ' ' + ("00" + firstdayHours.toString()).slice(-2) + ":" + ("00" + firstdayMinutes.toString()).slice(-2) + ":" + ("00" + firstdaySeconds.toString()).slice(-2) + " " + ampm;
            } else {
                return ("00" + firstdayDay.toString()).slice(-2) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("0000" + firstdayYear.toString()).slice(-4);
            }
        }

        $rootScope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('responsive', true)
            .withOption('autoWidth', false)
            // .withOption('paging', false)
            .withOption('deferRender', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            .withOption('dom', '<"top"<"left"<"length"l>>f>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>');


        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event) {
            if (event.targetScope.$id === $scope.$id) {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
})();