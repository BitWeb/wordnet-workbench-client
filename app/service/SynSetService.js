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

            this.saveSynSet = function (synSet) {
                var deferred = $q.defer();
                
                if (synSet.label == null) synSet.label = '?';

                var tempSynSet = angular.copy(synSet);

                if (synSet.id) {
                    tempSynSet.$update({id: synSet.id}, function (synSetResult) {
                        deferred.resolve(synSetResult);
                    });
                } else {
                    tempSynSet.$save(function (synSetResult) {
                        deferred.resolve(synSetResult);
                    });
                }

                return deferred.promise;
            };

            this.load = function () {

            };

            this.getList = function () {

            };

            this.setRelation = function (synSet, source, target, relTypeId) {
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
                if (length(synSet.synset_definitions) == 1) {
                	synSet.primary_definition = definition.text;
                }
            };

            this.setDefinitions = function (synSet, origDef, definition) {
            	isSame = $scope.selectedDefinition.text === synSet.primary_definition || length(synSet.primary_definition) == 0;
                if(origDef == $scope.selectedDefinition) {
                    angular.copy(definition, $scope.selectedDefinition);
                } else {
                    synSet.synset_definitions.push(angular.copy(definition));
                }
                if (isSame) {
                	synSet.primary_definition = definition.text;
                }
            };

            this.removeDefinition = function (synSet, definition) {
            	var index = synSet.synset_definitions.indexOf(definition);
				if (index > -1) {
					isSame = definition.text === synSet.primary_definition;
					synSet.synset_definitions.splice(index, 1);
					if (isSame || length(synSet.synset_definitions) == 0) {
						synSet.primary_definition = '';
						for (s in synSet.senses) {
							if (length(s.primary_definition) > 0) {
								synSet.primary_definition = s.primary_definition;
								break;
							}
						}
					}
				}
            };

            this.setPrimaryDefinition = function (synSet, definition) {
                for(var i = 0;i < synSet.synset_definitions.length;i++) {
                    synSet.synset_definitions[i].is_primary = false;
                }
                definition.is_primary = true;
                synSet.primary_definition = definition.text;
            };
        }
    ]);
});