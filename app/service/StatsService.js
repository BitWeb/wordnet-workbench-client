/**
 * Created by ij on 19.12.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/StatsService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi) {
            var self = this;

            $log.log('[service/StatsService] ctor');

            var statsList = null;

            //

            var statsListPromise = null;
            var fStatsListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function (lexid) {
            	statsList = null;

            	fStatsListPromiseResolved = false;
            	statsListPromise = wnwbApi.Statistics.query({'lexid': lexid}).$promise;

            	statsListPromise.then(function (result) {
            		statsList = result;
                	fStatsListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!statsListPromise) {
                    self.init();
                }
                return statsListPromise;
            };

        }
    ]);
});