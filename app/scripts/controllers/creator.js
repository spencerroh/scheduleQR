'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:CreatorCtrl
 * @description
 * # CreatorCtrl
 * Controller of the scheduleQrApp
 */
angular.module('scheduleQrApp')
    .controller('CreatorCtrl', ['$scope', '$state', 'scheduleData', '$cordovaDatePicker',
        function($scope, $state, scheduleData, $cordovaDatePicker) {
            function toReadableDateFormat(date) {
                var d = Date.create(date);
                var result = d.format('{yyyy}년 {M}월 {d}일 ', 'ko');
                result += d.format('{tt}') === 'am' ? '오전' : '오후';
                result += d.format(' {h}시 {m}분', 'ko');

                return result;
            }

            $scope.schedule = {};

            //today = mm+'/'+dd+'/'+yyyy;

            // $scope.schedule.summary = 'sample for debugging';
            // $scope.schedule.location = '장소';
            // $scope.schedule.description = '이곳은 설명을 입력하는 곳입니다.';
            // $scope.schedule.begin = new Date(2010, 11, 28, 14, 57);
            // $scope.schedule.end = new Date(2010, 11, 28, 14, 57);
            $scope.schedule.begin = new Date();
            $scope.schedule.end = new Date().addDays(1);
            $scope.beginDate = toReadableDateFormat($scope.schedule.begin);
            $scope.endDate = toReadableDateFormat($scope.schedule.end);
            
            $scope.pickStartDate = function () {
                console.log('1');
                var datePickerOptions = {
                    date: $scope.schedule.begin,
                    mode: 'datetime', // or 'time'
                    minDate: new Date(),
                    allowOldDates: false,
                    allowFutureDates: true,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(datePickerOptions).then(function(date){
                    $scope.schedule.begin = date;
                    $scope.beginDate = toReadableDateFormat($scope.schedule.begin);
                });
            };
            
            $scope.pickEndDate = function () {
                console.log('1');
                var datePickerOptions = {
                    date: $scope.schedule.end,
                    mode: 'datetime', // or 'time'
                    minDate: $scope.schedule.begin,
                    allowOldDates: false,
                    allowFutureDates: true,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(datePickerOptions).then(function(date){
                    $scope.schedule.end = date;
                    $scope.endDate = toReadableDateFormat($scope.schedule.end);
                });
            }


            console.log($scope.schedule);

            $scope.generate = function() {
                scheduleData.setSchedule($scope.schedule);
                $state.go('^.showQR', $scope.schedule);
            };
        }
    ]);
