/**
 * Created by ivar on 28.01.16.
 */

define([
    'angularAMD',
    'underscore',
    'service/SynSetRelTypeService'
], function (angularAMD) {

    angularAMD.service('service/SynSetService', [ '$rootScope', '$log', '$q', 'wnwbApi', 'service/SynSetRelTypeService',
        function($rootScope, $log, $q, wnwbApi, relTypeService) {
            var self = this;

            this.init = function () {

            };

            this.saveSynSet = function (synSet, senseList) {
                var deferred = $q.defer();
                
                if (synSet.label == null) synSet.label = '?';

                if(synSet.id) {
                    var tempSynSet = angular.copy(synSet);
                    tempSynSet.$update({id: synSet.id}, function (synSetResult) {
                        self.saveSynSetSenses(tempSynSet, senseList).then(function (result) {
                            deferred.resolve(synSetResult);
                        });
                    });
                } else {
                    var tempSynSet = angular.copy(synSet);
                    var relationsTemp = angular.copy(synSet.relations);
                    tempSynSet.relations = [];
                    tempSynSet.$save(function (synSetResult) {
                        self.saveSynSetSenses(tempSynSet, senseList).then(function (results) {
                            if(relationsTemp.length) {
                                tempSynSet.id = synSetResult.id;
                                for(var i = 0;i < relationsTemp.length;i++) {
                                    if(!relationsTemp[i].a_synset) {
                                        relationsTemp[i].a_synset = tempSynSet.id;
                                    }
                                    if(!relationsTemp[i].b_synset) {
                                        relationsTemp[i].b_synset = tempSynSet.id;
                                    }
                                }
                                tempSynSet.relations = relationsTemp;
                                tempSynSet.$update({id: tempSynSet.id}, function (synSetResult) {
                                    deferred.resolve(synSetResult);
                                });
                            } else {
                                deferred.resolve(synSetResult);
                            }
                        });
                    });
                }

                return deferred.promise;
            };

            this.saveSynSetSenses = function (synSet, senseList) {
                var promises = [];

                var srcIds = _.indexBy(synSet.senses, 'id');
                var dstIds = _.indexBy(senseList, 'id');

                var toRem = _.omit(srcIds, _.keys(dstIds));
                var toAdd = _.omit(dstIds, _.keys(srcIds));

                $log.log(toRem);
                $log.log(toAdd);

                for(k in toRem) {
                    promises.push(wnwbApi.Sense.get({id: toRem[k].id}, function (sense) {
                        sense.synset = null;
                        promises.push(sense.$update({id: sense.id}).$promise);
                    }).$promise);
                }
                for(k in toAdd) {
                    promises.push(wnwbApi.Sense.get({id: toAdd[k].id}, function (sense) {
                        sense.synset = synSet.id;
                        promises.push(sense.$update({id: sense.id}).$promise);
                    }).$promise);
                }

                return $q.all(promises);
            };

            this.load = function () {

            };

            this.getList = function () {

            };

            this.setRelation = function (synSet, source, target, relTypeId) {
                //TODO: create counter Rel
                var relationList = synSet.relations;
                relationList.push({
                    a_synset: source.id,
                    a_label: source.label,
                    b_synset: target.id,
                    b_label: target.label,
                    rel_type: relTypeId
                });
            };

            this.clearRelation = function (synSet, relationId) {
                var relationList = synSet.relations;
                if(relationId) {
                    var aTypeId = null;
                    var a_synset = null;
                    var b_synset = null;

                    for(var i = 0;i < relationList.length;i++) {
                        if(relationList[i].id == relationId) {
                            aTypeId = relationList[i].rel_type;
                            a_synset = relationList[i].a_synset;
                            b_synset = relationList[i].b_synset;
                            relationList.splice(i, 1);
                            break;
                        }
                    }
                    if(aTypeId) {
                        aType = relTypeService.getById(aTypeId);
                        bTypes = relTypeService.getCounterRelTypes(aType.id);
                        for(k in bTypes) {
                            var bTypeId = bTypes[k].id;
                            for(var i = 0;i < relationList.length;i++) {
                                if(relationList[i].rel_type == bTypeId && relationList[i].a_synset == b_synset && relationList[i].b_synset == a_synset) {
                                    relationList.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
            };

            this.getDefinitionById = function (synSet, definitionId) {
                for(k in synSet.synset_definitions) {
                    if(synSet.synset_definitions[k].id == definitionId) {
                        return synSet.synset_definitions[k];
                    }
                }

                return null;
            };

            this.addDefinition = function (synSet, definition) {
                synSet.synset_definitions.push(angular.copy(definition));
            };

            this.setDefinitions = function (synSet, definitionId, definition) {
                if(origDef == $scope.selectedDefinition) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    synSet.synset_definitions.push(angular.copy(def));
                }
            };

            this.removeDefinition = function (synSet, definition) {

            };

            this.setPrimaryDefinition = function (synSet, definition) {
                for(var i = 0;i < synSet.synset_definitions.length;i++) {
                    synSet.synset_definitions[i].is_primary = false;
                }
                definition.is_primary = true;
            };

            this.addSense = function (synSet, sense) {

            };

            this.removeSense = function (synSet, sense) {

            };

            this.addExtRef = function (synSet, extRef) {

            };

            this.removeExtRef = function (synSet, extRef) {

            };
        }
    ]);
});