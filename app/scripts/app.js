'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('scheduleQrApp', ['ionic', 'config', 'ngCordova', 'ja.qr'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
        function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $stateProvider
                .state('tabs', {
                    url: '/tabs',
                    abstract: true,
                    templateUrl: 'views/tabs.html'
                })
                .state('tabs.reader', {
                    url: '/reader',
                    views: {
                        'reader-tab': {
                            templateUrl: 'views/reader.html',
                            controller: 'ReaderCtrl'
                        }
                    }
                })
                .state('tabs.creator', {
                    url: '/creator',
                    views: {
                        'creator-tab': {
                            templateUrl: 'views/creator.html',
                            controller: 'CreatorCtrl'
                        }
                    }
                })
                .state('tabs.showQR', {
                    url: '/creator/showQR',
                    views: {
                        'creator-tab': {
                            templateUrl: 'views/showqr.html',
                            controller: 'ShowQRCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('tabs/reader');

            $ionicConfigProvider.platform.android.tabs.position('bottom');
            $ionicConfigProvider.platform.android.tabs.style('standard');
        }
    ])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    });
