'use strict';

/**
 * @ngdoc service
 * @name scheduleQrApp.scheduleData
 * @description
 * # scheduleData
 * Factory in the scheduleQrApp.
 */
angular.module('scheduleQrApp')
    .factory('scheduleData', function() {
        // Service logic

        var schedule = {};

        // Public API here
        return {
            setSchedule: function(s) {
                console.log(s);
                schedule = s;
            },

            getSchedule: function() {
                return schedule;
            }
        };
    });