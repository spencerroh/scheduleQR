/*jshint bitwise: false*/
(function () {
    'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:ReaderCtrl
 * @description
 * # ReaderCtrl
 * Controller of the scheduleQrApp
 */
    angular.module('scheduleQrApp')
        .controller('ReaderResultCtrl', ['$scope', 'scheduleData', '$cordovaCalendar',
            function ($scope, scheduleData, $cordovaCalendar) {
                $scope.registerSchedule = function () {
                    $cordovaCalendar.createEventInteractively({
                        title: $scope.rawSchedule.SUMMARY,
                        location: $scope.rawSchedule.LOCATION,
                        notes: $scope.rawSchedule.DESCRIPTION,
                        startDate: Date.create($scope.rawSchedule.DTSTART),
                        endDate: Date.create($scope.rawSchedule.DTEND)
                    }).then(function (result) {
                        console.log(result);
                    }, function (err) {
                        console.log(err);
                    });
                };

                function toReadableDateFormat(date) {
                    var d = Date.create(date);
                    var result = d.format('{yyyy}년 {M}월 {d}일 ', 'ko');
                    result += d.format('{tt}') === 'am' ? '오전' : '오후';
                    result += d.format(' {h}시 {m}분', 'ko');

                    return result;
                }

                var schedule = scheduleData.getSchedule();
                $scope.rawSchedule = scheduleData.getSchedule();

                schedule.DTSTART = toReadableDateFormat(schedule.DTSTART);
                schedule.DTEND = toReadableDateFormat(schedule.DTEND);
                $scope.schedule = schedule;

                $scope.rawSchedule = scheduleData.getSchedule();
                console.log('schedule', $scope.rawSchedule.DTSTART);
            }
        ]
    );
})();
