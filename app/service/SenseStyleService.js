/**
 * Created by ij on 15.05.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/SenseStyleService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi) {
            var self = this;

            $log.log('[service/SenseStyleService] ctor');

            var senseStyleList = null;
            var senseStyleMapCode = null;

            //

            var senseStyleListPromise = null;
            var fSenseStyleListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {
            	senseStyleList = null;
            	senseStyleMapCode = null;
            	lang = 'est';
            	if ($rootScope.language) {
            		lang = $rootScope.language;
            	}

            	fSenseStyleListPromiseResolved = false;
            	senseStyleListPromise = wnwbApi.SenseStyle.query({domain: 'style', language: lang }).$promise;

            	senseStyleListPromise.then(function (result) {
            		senseStyleList = result;
            		senseStyleMapCode = _.object(_.map(senseStyleList, function(item) { return [item.id, item] }));
            		fSenseStyleListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!senseStyleListPromise) {
                    $log.warn('[service/SenseStyleService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return senseStyleListPromise;
            };

            this.getByCode = function (code) {
                if(fSenseStyleListPromiseResolved) {
                    if(senseStyleMapCode[code]) {
                        return senseStyleMapCode[code];
                    }
                } else {
                    $log.warn('[service/SenseStyleService] getByCode(): senseStyleListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});