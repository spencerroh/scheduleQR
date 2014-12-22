'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:ReaderCtrl
 * @description
 * # ReaderCtrl
 * Controller of the scheduleQrApp
 */
angular.module('scheduleQrApp')
    .controller('ReaderCtrl', ['$scope', '$cordovaBarcodeScanner', '$cordovaCalendar',
        function($scope, $cordovaBarcodeScanner, $cordovaCalendar) {
            $scope.runQRCode = function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(imageData) {
                        var pattern = /(\w+):(.*)$/gm;
                        var matches = imageData.text.match(pattern);

                        $scope.schedule = {};
                        angular.forEach(matches, function(match) {
                            var groups = /(\w+):(.*)$/.exec(match);
                            $scope.schedule[groups[1]] = groups[2];
                        });

                        $scope.text = imageData.text;
                        $scope.format = imageData.format;
                        $scope.cancelled = imageData.cancelled;
                    }, function(error) {
                        $scope.text = error;
                        $scope.format = 'Error';
                        $scope.cancelled = 'Error';
                    });
            };

            $scope.registerSchedule = function() {
                $cordovaCalendar.createEventInteractively({
                    title: $scope.schedule.SUMMARY,
                    location: $scope.schedule.LOCATION,
                    notes: $scope.schedule.DESCRIPTION,
                    startDate: Date.create($scope.schedule.DTSTART),
                    endDate: Date.create($scope.schedule.DTEND)
                }).then(function(result) {
                    console.log(result);
                }, function(err) {
                    console.log(err);
                });
            };
        }
    ]);