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
        .controller('ReaderCtrl', ['$scope', '$cordovaBarcodeScanner', '$cordovaCamera', '$ionicPlatform', '$state', 'scheduleData', '$cordovaToast',
            function ($scope, $cordovaBarcodeScanner, $cordovaCamera, $ionicPlatform, $state, scheduleData, $cordovaToast) {
                function showQRData(qrData) {
                    console.log(qrData);
                    
                    var pattern = /(\w+):(.*)$/gm;
                    var matches = qrData.match(pattern);

                    var schedule = {};
                    angular.forEach(matches, function (match) {
                        var groups = /(\w+):(.*)$/.exec(match);
                        schedule[groups[1]] = groups[2];
                    });

                    scheduleData.setSchedule(schedule);
                    
                    $state.go('^.result');
                }
                
                function convertUTF16ToUTF8(str) {
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
                                showQRData(convertUTF16ToUTF8(res));
                            }
                            else {
                                $cordovaToast.show('QR코드를 읽는데 실패했습니다.', 'short', 'center');
                            }
                        });
                    });
                };
            }
        ]
    );
})(window.QCodeDecoder);