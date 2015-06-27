(function (QCodeDecoder) {
'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:ReaderCtrl
 * @description
 * # ReaderCtrl
 * Controller of the scheduleQrApp
 */
angular.module('scheduleQrApp')
    .controller('ReaderCtrl', ['$scope', '$cordovaBarcodeScanner', '$cordovaCalendar', '$cordovaCamera', '$ionicPlatform', '$state',
                               function ($scope, $cordovaBarcodeScanner, $cordovaCalendar, $cordovaCamera, $ionicPlatform, $state) {
            function showQRData(qrData) {
                console.log(qrData);
                
                var pattern = /(\w+):(.*)$/gm;
                var matches = qrData.match(pattern);

                $scope.schedule = {};
                angular.forEach(matches, function (match) {
                    var groups = /(\w+):(.*)$/.exec(match);
                    $scope.schedule[groups[1]] = groups[2];
                });

                $scope.$apply();
            }
                                   
            $scope.runQRCode = function () {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function (imageData) {
                        showQRData(imageData.text);
                    }, function (error) {
                        $scope.text = error;
                        $scope.format = 'Error';
                        $scope.cancelled = 'Error';

                        $state.go('^.creator');                
                    });
            };

            $scope.readFromCameraRoll = function () {
                $cordovaCamera.getPicture({
                    quality: 80,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                }).then(function (imageURI) {
                    var img = document.createElement('img');
                    img.setAttribute('src', "data:image/jpeg;base64," + imageURI);
                    
                    var qr = new QCodeDecoder();
                    qr.decodeFromImage(img, function (er, res) {
                        if (er == null) {
                            showQRData(res);
                        }
                        else {
                        }
                    });
                });
            };

            $scope.registerSchedule = function () {
                $cordovaCalendar.createEventInteractively({
                    title: $scope.schedule.SUMMARY,
                    location: $scope.schedule.LOCATION,
                    notes: $scope.schedule.DESCRIPTION,
                    startDate: Date.create($scope.schedule.DTSTART),
                    endDate: Date.create($scope.schedule.DTEND)
                }).then(function (result) {
                    console.log(result);
                }, function (err) {
                    console.log(err);
                });
            };
            /*
            $ionicPlatform.ready(function () {
                console.log('HeHe');
                $scope.runQRCode();
            });
            */
}]);
})(window.QCodeDecoder);