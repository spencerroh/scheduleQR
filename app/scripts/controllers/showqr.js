'use strict';

/**
 * @ngdoc function
 * @name scheduleQrApp.controller:ShowqrCtrl
 * @description
 * # ShowqrCtrl
 * Controller of the scheduleQrApp
 */
angular.module('scheduleQrApp')
    .controller('ShowQRCtrl', ['$scope', 'scheduleData', '$window', '$cordovaToast', '$cordovaSocialSharing',

        function ($scope, scheduleData, $window, $cordovaToast, $cordovaSocialSharing) {
            // QRickit qrickit.com
            // BEGIN:VEVENT
            // Event name       SUMMARY
            // Location         LOCATION
            // description      DESCRIPTION
            // Start DateTime   DTSTART
            // End DateTime     DTEND
            // END:VEVENT
            /*
	        $scope.schedules.push({
	            "SUMMARY": "이것은 제목입니다.",
	            "LOCATION": "위치",
	            "DESCRIPTION": "설명",
	            "DTSTART": "2014-04-05",
	            "DTEND": "2014-04-06"
	        }); */
            function makeQRCode(schedule) {
                var summary = schedule.summary || '';
                var location = schedule.location || '';
                var begin = schedule.begin || '';
                var end = schedule.end || '';
                var description = schedule.description || '';

                console.log(summary, location, begin, end, description);

                var encode = 'BEGIN:VEVENT\n';
                encode += 'SUMMARY:' + summary + '\n';
                encode += 'LOCATION:' + location + '\n';
                encode += 'DESCRIPTION:' + description + '\n';
                encode += 'DTSTART:' + Date.create(begin).format(Date.ISO8601_DATETIME) + '\n';
                encode += 'DTEND:' + Date.create(end).format(Date.ISO8601_DATETIME) + '\n';
                encode += 'END:VEVENT';

                return getBytes(encode);
            }

            function getBytes(str) {
                var out, i, len, c;

                out = '';
                len = str.length;

                /*jslint bitwise: true */
                for (i = 0; i < len; i++) {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007F)) {
                        out += str.charAt(i);
                    } else if (c > 0x07FF) {
                        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    }
                }
                /*jslint bitwise: false */
                return out;
            }

            $scope.saveToAlbum = function () {
                if ($window.canvas2ImagePlugin) {
                    $window.canvas2ImagePlugin.saveImageDataToLibrary(
                        function ( /*success*/ ) {
                            $cordovaToast.show('QR코드를 저장했습니다.', 'short', 'center');
                        },
                        function ( /*error*/ ) {
                            $cordovaToast.show('저장하는데 실패했습니다.', 'short', 'center');
                        },
                        document.querySelector('#qr > canvas')
                    );
                }
            };

            $scope.shareSchedule = function () {
                var text = extractText(scheduleData);
                var url = document.querySelector('#qr > canvas').toDataURL();

                // 테스트한 결과 카톡은 이미지만 전송됨. 글자는 전송안됨.

                $cordovaSocialSharing
                    .share(text, null, url, null)
                    .then(function (result) {
                        // Success!
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
            };

            var extractText = function (encoded) {
                return encoded.summary;
            };

            var schedule = scheduleData.getSchedule();
            $scope.encodedData = makeQRCode(schedule);
        }
    ]);
