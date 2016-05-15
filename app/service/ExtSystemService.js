/**
 * Created by ij on 15.05.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/ExtSystemService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi) {
            var self = this;

            $log.log('[service/ExtSystemService] ctor');

            var extSystemList = null;
            var extSystemMapId = null;

            //

            var extSystemListPromise = null;
            var fExtSystemListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {
            	extSystemList = null;
            	extSystemMapId = null;

                fExtSystemListPromiseResolved = false;
                extSystemListPromise = wnwbApi.ExtSystem.query().$promise;

                extSystemListPromise.then(function (result) {
                	extSystemList = result;
                	extSystemMapId = _.object(_.map(extSystemList, function(item) { return [item.id, item] }));
                	fExtSystemListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!extSystemListPromise) {
                    $log.warn('[service/ExtSystemService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return extSystemListPromise;
            };

            this.getById = function (relTypeId) {
                if(fExtSystemListPromiseResolved) {
                    if(extSystemMapId[relTypeId]) {
                        return extSystemMapId[relTypeId];
                    }
                } else {
                    $log.warn('[service/ExtSystemService] getById(): extSystemListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});