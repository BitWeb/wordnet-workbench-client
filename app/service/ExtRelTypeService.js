/**
 * Created by ij on 15.05.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/ExtRelTypeService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi) {
            var self = this;

            $log.log('[service/ExtRelTypeService] ctor');

            var extRelTypeList = null;
            var extRelTypeMapId = null;

            //

            var extRelTypeListPromise = null;
            var fExtRelTypeListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {
            	extRelTypeList = null;
            	extRelTypeMapId = null;

                fExtRelTypeListPromiseResolved = false;
                extRelTypeListPromise = wnwbApi.ExtRelType.query().$promise;

                extRelTypeListPromise.then(function (result) {
                	extRelTypeList = result;
                	extRelTypeMapId = _.object(_.map(extRelTypeList, function(item) { return [item.id, item] }));
                	fExtRelTypeListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!extRelTypeListPromise) {
                    $log.warn('[service/ExtRelTypeService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return extRelTypeListPromise;
            };

            this.getById = function (relTypeId) {
                if(fExtRelTypeListPromiseResolved) {
                    if(extRelTypeMapId[relTypeId]) {
                        return extRelTypeMapId[relTypeId];
                    }
                } else {
                    $log.warn('[service/ExtRelTypeService] getById(): extRelTypeListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});