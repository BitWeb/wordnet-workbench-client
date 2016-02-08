/**
 * Created by ivar on 28.01.16.
 */

define([
    'angularAMD',
    'underscore',
    'service/SenseRelTypeService'
], function (angularAMD) {

    angularAMD.service('service/SenseService', [ '$rootScope', '$log', '$q', 'wnwbApi', 'service/SenseRelTypeService',
        function($rootScope, $log, $q, wnwbApi, relTypeService) {
            var self = this;

            this.init = function () {

            };

            this.saveSense = function (sense, senseList) {
                $log.log('saveSense');
                $log.log(sense);

                var deferred = $q.defer();

                var label = '?';
                sense.label = label;

                if(sense.id) {
                    var tempSense = angular.copy(sense);
                    tempSense.$update({id: sense.id}, function (senseResult) {
                        deferred.resolve(senseResult);
                    });
                } else {
                    var tempSense = angular.copy(sense);
                    var relationsTemp = angular.copy(sense.relations);
                    tempSense.relations = [];
                    tempSense.$save(function (senseResult) {
                        if(relationsTemp.length) {
                            tempSense.id = senseResult.id;
                            for(var i = 0;i < relationsTemp.length;i++) {
                                if(!relationsTemp[i].a_sense) {
                                    relationsTemp[i].a_sense = tempSense.id;
                                }
                                if(!relationsTemp[i].b_sense) {
                                    relationsTemp[i].b_sense = tempSense.id;
                                }
                            }
                            tempSense.relations = relationsTemp;
                            tempSense.$update({id: tempSense.id}, function (senseResult) {
                                deferred.resolve(senseResult);
                            });
                        } else {
                            deferred.resolve(senseResult);
                        }
                    });
                }

                return deferred.promise;
            };

            this.load = function () {

            };

            this.getList = function () {

            };

            this.setRelation = function (sense, source, target, relTypeId) {
                //TODO: create counter Rel
                var relationList = sense.relations;
                relationList.push({
                    a_sense: source.id,
                    a_label: source.label,
                    b_sense: target.id,
                    b_label: target.label,
                    rel_type: relTypeId
                });
            };

            this.clearRelation = function (sense, relationId) {
                var relationList = sense.relations;
                if(relationId) {
                    var aTypeId = null;
                    var a_sense = null;
                    var b_sense = null;

                    for(var i = 0;i < relationList.length;i++) {
                        if(relationList[i].id == relationId) {
                            aTypeId = relationList[i].rel_type;
                            a_sense = relationList[i].a_sense;
                            b_sense = relationList[i].b_sense;
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
                                if(relationList[i].rel_type == bTypeId && relationList[i].a_sense == b_sense && relationList[i].b_sense == a_sense) {
                                    relationList.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
            };

            this.getDefinitionById = function (sense, definitionId) {
                for(k in sense.sense_definitions) {
                    if(sense.sense_definitions[k].id == definitionId) {
                        return sense.sense_definitions[k];
                    }
                }

                return null;
            };

            this.addDefinition = function (sense, definition) {
                sense.sense_definitions.push(angular.copy(definition));
            };

            this.setDefinitions = function (sense, definitionId, definition) {
                if(origDef == $scope.selectedDefinition) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    sense.sense_definitions.push(angular.copy(def));
                }
            };

            this.removeDefinition = function (sense, definition) {

            };

            this.setPrimaryDefinition = function (sense, definition) {
                for(var i = 0;i < sense.sense_definitions.length;i++) {
                    sense.sense_definitions[i].is_primary = false;
                }
                definition.is_primary = true;
            };

            this.addExtRef = function (sense, extRef) {

            };

            this.removeExtRef = function (sense, extRef) {

            };
        }
    ]);
});