/**
 * Created by ivar on 20.01.16.
 */

define([
    'angularAMD',
    'underscore',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.service('service/SynSetRelTypeService', [ '$rootScope', '$log', '$q', 'wnwbApi', 'service/LexiconService',
        function($rootScope, $log, $q, wnwbApi, lexiconService) {
            var self = this;

            $log.log('[service/SynSetRelTypeService] ctor');

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
                lexiconPromise = lexiconService.getWorkingLexiconPromise();
                
                lexiconPromise.then( function (lexicon) {
                    lexicon = lexiconService.getWorkingLexicon();
                    relTypeListPromise = wnwbApi.SynSetRelType.query({offset:0, limit:1000, lexid:lexicon.id}).$promise;

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
                });
            };

            this.getList = function () {
                if(!relTypeListPromise) {
                    $log.warn('[service/SynSetRelTypeService] getList(): init() hasn\'t been run before.');
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
                    $log.warn('[service/SynSetRelTypeService] getById(): relTypeListPromise isn\'t resolved');
                }
                return null;
            };
            
            $rootScope.$on("workingLexiconChanged", function() {
                console.log('[service/SynSetRelTypeService] on.workingLexiconChanged reloading resList');
                 self.init();
            }); 
            
            
        }
    ]);
});