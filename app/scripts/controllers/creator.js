'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:CreatorCtrl
 * @description
 * # CreatorCtrl
 * Controller of the scheduleQrApp
 */
angular.module('scheduleQrApp')
    .controller('CreatorCtrl', ['$scope', '$state', 'scheduleData',
        function($scope, $state, scheduleData) {
            $scope.schedule = {};
            $scope.schedule.summary = 'sample for debugging';
            $scope.schedule.location = '장소';
            $scope.schedule.description = '이곳은 설명을 입력하는 곳입니다.';
            $scope.schedule.begin = new Date(2010, 11, 28, 14, 57);
            $scope.schedule.end = new Date(2010, 11, 28, 14, 57);

            console.log($scope.schedule);

            $scope.generate = function() {
                scheduleData.setSchedule($scope.schedule);
                $state.go('^.showQR', $scope.schedule);
            };
        }
    ]);