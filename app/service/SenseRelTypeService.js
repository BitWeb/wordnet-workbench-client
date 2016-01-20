/**
 * Created by ivar on 20.01.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/SenseRelTypeService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi, lexiconService) {
            var self = this;

            $log.log('[service/SenseRelTypeService] ctor');

            var relTypeList = null;
            var relTypeMapId = null;

            //
            var relTypeCounterMap = null;

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
                relTypeListPromise = wnwbApi.SenseRelType.query().$promise;

                relTypeListPromise.then(function (result) {
                    relTypeList = result;
                    relTypeMapId = _.object(_.map(relTypeList, function(item) { return [item.id, item] }));
                    relTypeCounterMap = {};
                    for(k in relTypeList) {
                        if(relTypeList[k].other) {
                            if(!relTypeCounterMap[relTypeList[k].other]) {
                                relTypeCounterMap[relTypeList[k].other] = [relTypeList[k]];
                            } else {
                                relTypeCounterMap[relTypeList[k].other].push(relTypeList[k]);
                            }
                        }
                    }
                    fRelTypeListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!relTypeListPromise) {
                    $log.warn('[service/SenseRelTypeService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return relTypeListPromise;
            };

            this.getCounterRelTypes = function (relTypeId) {
                $log.log('relTypeCounterMap');
                $log.log(relTypeCounterMap);

                if(relTypeCounterMap[relTypeId]) {
                    return relTypeCounterMap[relTypeId];
                } else {
                    return [];
                }
            };

            this.getCountersById = function (relTypeId) {
                if(relTypeCounterMap[relTypeId]) {
                    return relTypeCounterMap[relTypeId];
                } else {
                    return [];
                }
            };

            this.getById = function (relTypeId) {
                if(fRelTypeListPromiseResolved) {
                    if(relTypeMapId[relTypeId]) {
                        return relTypeMapId[relTypeId];
                    }
                } else {
                    $log.warn('[service/SenseRelTypeService] getById(): relTypeListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});