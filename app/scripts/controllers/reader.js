/*jshint bitwise: false*/
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

                function UTF8ToUTF16(str) {
                    var out, i, len, c;
                    var char2, char3;

                    out = '';
                    len = str.length;
                    i = 0;
                    while (i < len) {
                        c = str.charCodeAt(i++);
                        switch(c >> 4)
                        { 
                            case 0: 
                            case 1: 
                            case 2: 
                            case 3: 
                            case 4: 
                            case 5: 
                            case 6: 
                            case 7:
                            // 0xxxxxxx
                            out += str.charAt(i-1);
                            break;
                          case 12: case 13:
                            // 110x xxxx   10xx xxxx
                            char2 = str.charCodeAt(i++);
                            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                            break;
                          case 14:
                            // 1110 xxxx  10xx xxxx  10xx xxxx
                            char2 = str.charCodeAt(i++);
                            char3 = str.charCodeAt(i++);
                            out += String.fromCharCode(((c & 0x0F) << 12) |
                                           ((char2 & 0x3F) << 6) |
                                           ((char3 & 0x3F) << 0));
                            break;
                        }
                    }

                    return out;
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
                        img.setAttribute('src', 'data:image/jpeg;base64,' + imageURI);

                        var qr = new QCodeDecoder();
                        qr.decodeFromImage(img, function (er, res) {
                            if (er === null) {
                                showQRData(UTF8ToUTF16(res));
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