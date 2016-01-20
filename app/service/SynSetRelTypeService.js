/**
 * Created by ivar on 20.01.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/SynSetRelTypeService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi, lexiconService) {
            var self = this;

            $log.log('[service/SynSetRelTypeService] ctor');

            var relTypeList = null;
            var relTypeMapId = null;

            var relTypeListPromise = null;
            var fRelTypeListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {
                relTypeList = null;
                relTypeMapId = null;

                fRelTypeListPromiseResolved = false;
                relTypeListPromise = wnwbApi.SynSetRelType.query().$promise;

                relTypeListPromise.then(function (result) {
                    relTypeList = result;
                    relTypeMapId = _.object(_.map(relTypeList, function(item) { return [item.id, item] }));
                    fRelTypeListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!relTypeListPromise) {
                    $log.warn('[service/SynSetRelTypeService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return relTypeListPromise;
            };

            this.getCounterRelTypes = function () {

            };

            this.getById = function (relTypeId) {
                if(fRelTypeListPromiseResolved) {
                    if(relTypeMapId[relTypeId]) {
                        return relTypeMapId[relTypeId];
                    }
                } else {
                    $log.warn('[service/SynSetRelTypeService] getById(): relTypeListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});