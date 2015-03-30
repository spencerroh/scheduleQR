'use strict';

/**
 * @ngdoc directive
 * @name scheduleQrApp.directive:qrCode
 * @description
 * # qrCode
 */
angular.module('scheduleQrApp')
    .directive('qrCode', ['$timeout', '$window',
        function ($timeout, $window) {

            return {
                restrict: 'E',
                template: '<canvas ng-hide="image"></canvas><image ng-if="image" ng-src="{{canvasImage}}"/>',
                scope: {
                    typeNumber: '=',
                    correctionLevel: '=',
                    inputMode: '=',
                    size: '=',
                    text: '=',
                    image: '=',
                    option: '='
                },
                controller: 'QrCtrl',
                link: function postlink(scope, element, attrs) {

                    if (scope.text === undefined) {
                        throw new Error('The `text` attribute is required.');
                    }

                    var canvas = element.find('canvas')[0];
                    var canvas2D = !!$window.CanvasRenderingContext2D;

                    scope.TYPE_NUMBER = scope.getTypeNumeber();
                    scope.TEXT = scope.getText();
                    scope.CORRECTION = scope.getCorrection();
                    scope.SIZE = scope.getSize();
                    scope.INPUT_MODE = scope.getInputMode(scope.TEXT);


                    scope.canvasImage = 'http://lorempixel.com/500/500/';

                    var draw = function (context, qr, modules, tile, x, y) {
                        for (var row = 0; row < modules; row++) {
                            for (var col = 0; col < modules; col++) {
                                var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                                    h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
                                context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
                                context.fillRect(x + Math.round(col * tile), y + Math.round(row * tile), w, h);
                            }
                        }
                    };

                    var render = function (canvas, value, typeNumber, correction, size, inputMode) {
                        var trim = /^\s+|\s+$/g;
                        var text = value.replace(trim, '');

                        var qr = new QRCode(typeNumber, correction, inputMode);
                        qr.addData(text);
                        qr.make();

                        var context = canvas.getContext('2d');

                        var modules = qr.getModuleCount();
                        var tile = (size - 20) / modules;

                        var header = '병원간다요?';
                        var footer1 = '2015.08.12 12:00 ~ 2015.08.12 24:00';
                        var footer2 = '행운이가 세상 빛을 본다';
                        var appName = '원샷 스케쥴러';

                        var fontSize = 20;
                        var lineMargin = 10;
                        var lrMargin = 10;
                        var y = 0;

                        canvas.width = size;
                        canvas.height = size + 6 * lineMargin + 4 * fontSize - 10;

                        if (canvas2D) {
                            context.fillStyle = "#ffffff";
                            context.fillRect(0, 0, canvas.width, canvas.height);

                            y = lineMargin + fontSize;

                            context.fillStyle = "#000000";
                            context.font = 'bold 20px Noto CKJ';
                            context.fillText(header, (canvas.width - context.measureText(header).width) / 2, y);

                            y += lineMargin;

                            draw(context, qr, modules, tile, 10, y + 10);
                            context.strokeStyle = "#6699ff";
                            context.lineWidth = 1;
                            context.strokeRect(5, y + 5, size - 10, size - 10);

                            fontSize = 15;
                            y += canvas.width + lineMargin + fontSize;

                            context.fillStyle = "#000000";
                            context.font = 'bold 15px Noto CKJ';
                            context.fillText(footer1, canvas.width - context.measureText(footer1).width - lrMargin, y);

                            y += lineMargin + fontSize;

                            context.fillStyle = "#000000";
                            context.font = 'bold 15px Noto CKJ';
                            context.fillText(footer2, canvas.width - context.measureText(footer2).width - lrMargin, y);

                            fontSize = 20;
                            y += lineMargin + fontSize;

                            context.fillStyle = "#4477ff";
                            context.font = 'bold 20px Noto CKJ';
                            context.fillText(appName, (canvas.width - context.measureText(appName).width) / 2, y);

                            scope.canvasImage = canvas.toDataURL();
                        }
                    };

                    render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);

                    $timeout(function () {
                        scope.$watch('text', function (value, old) {
                            if (value !== old) {
                                scope.TEXT = scope.getText();
                                scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
                            }
                        });

                        scope.$watch('correctionLevel', function (value, old) {
                            if (value !== old) {
                                scope.CORRECTION = scope.getCorrection();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
                            }
                        });

                        scope.$watch('typeNumber', function (value, old) {
                            if (value !== old) {
                                scope.TYPE_NUMBER = scope.getTypeNumeber();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
                            }
                        });

                        scope.$watch('size', function (value, old) {
                            if (value !== old) {
                                scope.SIZE = scope.getSize();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
                            }
                        });

                        scope.$watch('inputMode', function (value, old) {
                            if (value !== old) {
                                scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
                            }
                        });
                    });

                }
            };
  }]);