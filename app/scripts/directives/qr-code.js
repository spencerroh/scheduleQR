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
                    header: '@',
                    footer: '@'
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
                    scope.HEADER = scope.header || '';
                    scope.FOOTER = scope.footer || '';

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

                    var render = function (canvas, value, typeNumber, correction, size, inputMode, header, footer) {
                        var trim = /^\s+|\s+$/g;
                        var text = value.replace(trim, '');

                        var qr = new QRCode(typeNumber, correction, inputMode);
                        qr.addData(text);
                        qr.make();

                        var context = canvas.getContext('2d');

                        var modules = qr.getModuleCount();
                        var tile = size / modules;
                        canvas.width = size;
                        canvas.height = size + 50;

                        if (canvas2D) {
                            context.fillStyle = "#ff0000";
                            context.font = 'bold 20px Noto CKJ';
                            context.fillText(header, (size - context.measureText(header).width) / 2, 20);

                            draw(context, qr, modules, tile, 0, 25);
                            scope.canvasImage = canvas.toDataURL();
                        }
                    };

                    render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);

                    $timeout(function () {
                        scope.$watch('text', function (value, old) {
                            if (value !== old) {
                                scope.TEXT = scope.getText();
                                scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);
                            }
                        });

                        scope.$watch('correctionLevel', function (value, old) {
                            if (value !== old) {
                                scope.CORRECTION = scope.getCorrection();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);
                            }
                        });

                        scope.$watch('typeNumber', function (value, old) {
                            if (value !== old) {
                                scope.TYPE_NUMBER = scope.getTypeNumeber();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);
                            }
                        });

                        scope.$watch('size', function (value, old) {
                            if (value !== old) {
                                scope.SIZE = scope.getSize();
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);
                            }
                        });

                        scope.$watch('inputMode', function (value, old) {
                            if (value !== old) {
                                scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
                                render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.HEADER, scope.FOOTER);
                            }
                        });
                    });

                }
            };
  }]);