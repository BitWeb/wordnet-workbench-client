/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate',
    'service/LexiconService',
    'service/SenseRelTypeService',
    'service/SenseService'
], function (angularAMD) {

    angularAMD.controller('SenseCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$q',
        '$log',
        '$uibModal',
        'wnwbApi',
        '$animate',
        'service/LexiconService',
        'service/SenseRelTypeService',
        'service/SenseService',
        'relTypes',
        function (
            $scope,
            $state,
            $stateParams,
            $q,
            $log,
            $uibModal,
            wnwbApi,
            $animate,
            lexiconService,
            relTypeService,
            senseService,
            relTypes)
        {
            if(!$scope.baseState) {
                $scope.baseState = $state.get('sense');
            } else {
                $scope.baseState = $state.get($scope.baseState.name+'.sense');
            }

            var senseDeferred = $q.defer();
            var sensePromise = senseDeferred.promise;

            var senseId = 0;
            if($stateParams.senseId) {
                senseId = $stateParams.senseId;
            }

            $scope.relTypes = relTypes;

            $scope.sense = {};
            $scope.currentSense = {};

            //TODO: use DomainService instead
            var domains = wnwbApi.Domain.query(function () {
                $scope.domains = domains;
            });




            ////////////////////////////
            // Sense definition methods
            ////////////////////////////

            $scope.selectedDefinition = null;
            $scope.tempDef = {};
            $scope.selectDefinition = function (def) {
                $scope.selectedDefinition = def;
                if($scope.selectedDefinition) {
                    $state.go('.', {}, {relative: $scope.baseState}).then(function () {
                        $state.go('.def', {defId: $scope.selectedDefinition.id}, {relative: $scope.baseState}).then(function () {

                        });
                    });
                }
            };

            $scope.getDefinition = function (definitionId) {
                var deferred = $q.defer();

                if(definitionId) {
                    sensePromise.then(function (sense) {
                        $log.log('get definition');
                        var fFound = false;
                        for(k in sense.sense_definitions) {
                            if(sense.sense_definitions[k].id == definitionId) {
                                $scope.selectedDefinition = sense.sense_definitions[k];
                                deferred.resolve(sense.sense_definitions[k]);
                                fFound = true;
                                break;
                            }
                        }
                        if(fFound) {
                            deferred.reject('not found');
                        }
                    });
                } else {
                    if($scope.selectedDefinition) {
                        deferred.resolve($scope.selectedDefinition);
                    } else {
                        deferred.resolve(null);
                    }
                }

                return deferred.promise;
            };

            $scope.addDefinition = function () {
                $state.go('.def', {}, {relative: $scope.baseState});
                $scope.selectedDefinition = null;
            };

            $scope.deleteDefinition = function (definition) {
                var index = $scope.sense.sense_definitions.indexOf(definition);
                if (index > -1) {
                    $scope.sense.sense_definitions.splice(index, 1);
                }
            };

            $scope.discardDefinition = function () {
                $state.go('sense');
            };

            $scope.setPrimaryDefinition = function (value) {
                for(var i = 0;i < $scope.currentSense.sense_definitions.length;i++) {
                    $scope.currentSense.sense_definitions[i].is_primary = false;
                }
                value.is_primary = true;
            };

            $scope.saveDefinition = function (def, origDef) {
                if(def.id) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    if(origDef == $scope.selectedDefinition) {
                        angular.copy(def, $scope.selectedDefinition);
                    } else {
                        $scope.currentSense.sense_definitions.push(angular.copy(def));
                    }
                }
            };



            /////////////////////////
            // Sense example methods
            /////////////////////////

            $scope.addExample = function () {
                var newExample = {
                    text: '',
                    language: $scope.language,
                    source: ''
                };
                $scope.sense.examples.push(newExample);
                $scope.selectedExample = newExample;
                $scope.tempExample = angular.copy(newExample);
            };

            $scope.tempExample = {};
            $scope.selectedExample = null;

            $scope.editExample = function (example) {
                if($scope.selectedExample) {
                    $scope.saveExample();
                    $scope.cancelExample();
                }
                $scope.tempExample = angular.copy(example);
                $scope.tempExample.language = $scope.languageCodeMap[$scope.tempExample.language];
                $scope.selectedExample = example;
            };

            $scope.setPrimaryExample = function (value) {
                for(var i = 0;i < $scope.currentSense.examples.length;i++) {
                    $scope.currentSense.examples[i].is_primary = false;
                }
                value.is_primary = true;
            };

            $scope.validateExample = function (example) {
                $scope.exampleErrors = {};
                var fIsValid = true;
                if(!example.language || !$scope.languageCodeMap[example.language]) {
                    $scope.exampleErrors.language = {invalid: true};
                    fIsValid = false;
                }
                if(!example.text || !example.text.length) {
                    $scope.exampleErrors.text = {required: true};
                    fIsValid = false;
                }
                return fIsValid;
            };

            $scope.saveExample = function () {
                var tempExample = angular.copy($scope.tempExample);
                if(tempExample.language.code) {
                    tempExample.language = tempExample.language.code;
                } else {
                    tempExample.language = null;
                }
                if($scope.validateExample(tempExample)) {
                    angular.copy(tempExample, $scope.selectedExample);
                    $scope.cancelExample();
                }
            };

            $scope.cancelExample = function () {
                if(!$scope.validateExample($scope.selectedExample)) {
                    $scope.deleteExample($scope.selectedExample);
                }
                $scope.selectedExample = null;
            };

            $scope.deleteExample = function (example) {
                var index = $scope.sense.examples.indexOf(example);
                if (index > -1) {
                    $scope.sense.examples.splice(index, 1);
                }
            };



            //////////////////////////
            // Sense relation methods
            //////////////////////////

            // Populates relation tree view
            $scope.$watchCollection('sense.relations', function (newValue, oldValue) {
                if(newValue) {

                    $scope.relTree = [
                        {name: 'Directional (outgoing)', type: 'do', nodes: []},
                        {name: 'Directional (incoming)', type: 'di', nodes: []},
                        {name: 'Bidirectional', type: 'bd', nodes: []},
                        {name: 'Non-directional', type: 'nd', nodes: []}
                    ];

                    var relationsGrouped = _.groupBy($scope.sense.relations, function (item) {
                        return item.rel_type;
                    });

                    for(k in relationsGrouped) {
                        var relType = relTypeService.getById(k);
                        var nodes_out = [];
                        var nodes_in = [];
                        for(k2 in relationsGrouped[k]) {
                            var obj = {
                                rel: relationsGrouped[k][k2],
                                name: relationsGrouped[k][k2].a_label,
                                type: 'rel',
                                nodes: []
                            };
                            if(relationsGrouped[k][k2].a_sense == $scope.sense.id) {
                                obj.name = relationsGrouped[k][k2].b_label;
                                nodes_out.push(obj);
                            }
                            if(relationsGrouped[k][k2].b_sense == $scope.sense.id) {
                                nodes_in.push(obj);
                                obj.name = relationsGrouped[k][k2].a_label;
                            }
                        }
                        if(relType.direction == 'd') {
                            if(nodes_out.length) {
                                $scope.relTree[0].nodes.push({
                                    name: relType.name,
                                    type: 'rel_type',
                                    relType: relType,
                                    relDir: 'ab',
                                    nodes: nodes_out
                                });
                            }
                            if(nodes_in.length) {
                                $scope.relTree[1].nodes.push({
                                    name: relType.name,
                                    type: 'rel_type',
                                    relType: relType,
                                    relDir: 'ba',
                                    nodes: nodes_in
                                });
                            }
                        }
                        if(relType.direction == 'b') {
                            $scope.relTree[2].nodes.push({
                                name: relType.name,
                                type: 'rel_type',
                                relType: relType,
                                relDir: 'ab',
                                nodes: _.union(nodes_in, nodes_out)
                            });
                        }
                        if(relType.direction == 'n') {
                            $scope.relTree[3].nodes.push({
                                name: relType.name,
                                type: 'rel_type',
                                relType: relType,
                                relDir: 'ab',
                                nodes: _.union(nodes_in, nodes_out)
                            });
                        }
                    }
                }
            });

            $scope.selectRel = function (relation) {
                $scope.selectedRel = relation;
                if($scope.selectedRel) {
                    if($scope.selectedRel.id) {
                        $state.go('sense.rel', {relId: relation.id});
                    } else {
                        $state.go('sense').then(function () {
                            $state.go('sense.rel', {relId: null}).then(function () {

                            });
                        });
                    }
                }
            };

            $scope.getRelation = function (relId) {
                var deferred = $q.defer();

                if(relId) {
                    sensePromise.then(function (sense) {
                        var fFound = false;
                        for (k in sense.relations) {
                            if (sense.relations[k].id == relId) {
                                $scope.selectedRel = sense.relations[k];
                                deferred.resolve(sense.relations[k]);
                                fFound = true;
                                break;
                            }
                        }
                        if (fFound) {
                            deferred.reject('not found');
                        }

                        deferred.resolve(null);
                    });
                } else {
                    if($scope.selectedRel) {
                        deferred.resolve($scope.selectedRel);
                    } else {
                        deferred.resolve(null);
                    }
                }

                return deferred.promise;
            };

            $scope.getRelationList = function () {
                var deferred = $q.defer();

                $log.log('Get relation list');

                sensePromise.then(function (sense) {
                    $log.log('relation list resolve');
                    deferred.resolve($scope.sense.relations);
                });

                return deferred.promise;
            };

            // Used by RelCtrl to remove existing relations
            $scope.clearRel = function (relId) {
                senseService.clearRelation($scope.sense, relId);
            };

            // Used by RelCtrl to create relations
            $scope.setRel = function (source, target, relTypeId) {
                senseService.setRelation($scope.sense, source, target, relTypeId);
            };

            $scope.addRel = function (relType, relDir) {
                $scope.selectedRel = null;
                if(relType) {
                    $log.log('set rel type id '+relType.id);
                    $state.go('sense.rel', {relId: null, relTypeId: relType.id, relDir: relDir});
                } else {
                    $state.go('sense.rel', {relId: null});
                }
            };

            $scope.discardRel = function () {
                $state.go('^');
            };

            $scope.saveRel = function (rel, selectedRelType, counterRelType, targetSense) {
                $state.go('^');
            };

            $scope.deleteRel = function (relation) {
                if(relation) {
                    senseService.clearRelation($scope.sense, relation.id);
                }
            };



            ////////////////////////
            // External ref methods
            ////////////////////////

            $scope.addExtRef = function () {
                var newExtRef = {
                    system: '',
                    type_ref_code: '',
                    reference: ''
                };
                $scope.sense.sense_externals.push(newExtRef);
                $scope.selectedExtRef = newExtRef;
                $scope.tempExtRef = angular.copy(newExtRef);
            };

            $scope.tempExtRef = {};
            $scope.selectedExtRef = null;

            $scope.editExtRef = function (extRef) {
                if($scope.selectedExtRef) {
                    $scope.saveExample();
                }
                $scope.tempExtRef = angular.copy(extRef);
                $scope.selectedExtRef = extRef;
            };

            $scope.saveExtRef = function () {
                if($scope.selectedExtRef) {
                    angular.copy($scope.tempExtRef, $scope.selectedExtRef);
                    $scope.cancelExtRef();
                }
            };

            $scope.cancelExtRef = function () {
                $scope.selectedExtRef = null;
            };

            $scope.deleteExtRef = function (extRef) {
                var index = $scope.sense.sense_externals.indexOf(extRef);
                if (index > -1) {
                    $scope.sense.sense_externals.splice(index, 1);
                }
            };

            $scope.setExtRefKey = function (extRef) {
                return $uibModal.open({
                    templateUrl: 'view/main/literalSerachModal.html',
                    scope: $scope,
                    controller: 'main/literalSearchCtrl',
                    resolve: {
                        searchType: function () {return 'sense';},
                        lexiconMode: function () {return 'any';}
                    }
                }).result.then(function (sense) {
                        if(sense) {
                            $scope.tempExtRef.reference = sense.id;
                        }
                    },
                    function (result) {

                    });
            };



            /////////////////
            // Sense methods
            /////////////////

            $scope.showDefinition = function () {
                $scope.secondaryView = 'definition';
            };

            $scope.showRelation = function () {
                $scope.secondaryView = 'relation';
            };

            $scope.saveAll = function () {
                $scope.saveExtRef();
            };

            $scope.validateSense = function (sense) {
                $scope.senseErrors = {};
                var fIsValid = true;
                if(!sense.lexical_entry || !sense.lexical_entry.lemma || !sense.lexical_entry.lemma.length) {
                    $scope.senseErrors.lemma = {required: true};
                    fIsValid = false;
                }
                return fIsValid;
            };

            $scope.saveSense = function () {
                if(!$scope.validateSense($scope.sense)) {
                    return;
                }

                $scope.saveAll();

                if($scope.sense.id) {
                    if($scope.currentSynSet !== undefined) {
                        $scope.sense.$update({id: $scope.sense.id}, function () {
                            wnwbApi.Sense.get({id: senseId}, function (result) {
                                $scope.sense = result;
                                $scope.$parent.saveSense($scope.sense);
                                $state.go('^', {senseId: $scope.sense.id});
                            });
                        });
                    } else {
                        $scope.sense.$update({id: $scope.sense.id}, function () {
                            wnwbApi.Sense.get({id: senseId}, function (result) {
                                $scope.sense = result;
                                $state.go('.', {id: $scope.sense.id}, {relative: $scope.baseState});
                            });
                        });
                    }
                } else {
                    $scope.sense.lexical_entry.lexicon = lexiconService.getWorkingLexicon().id;
                    if($scope.currentSynSet !== undefined) {
                        $scope.sense.$save(function (result) {
                            $scope.sense = result;
                            $scope.$parent.saveSense($scope.sense);
                            $state.go('^', {senseId: $scope.sense.id});
                        });
                    } else {
                        var tempSense = angular.copy($scope.sense);
                        var relationsTemp = tempSense.relations;
                        tempSense.relations = [];
                        tempSense.$save(function (result) {
                            //Success
                            if(tempSense.id) {
                                for(var i = 0;i < relationsTemp.length;i++) {
                                    if(relationsTemp[i].a_sense == null) {
                                        relationsTemp[i].a_sense = tempSense.id;
                                    }
                                    if(relationsTemp[i].b_sense == null) {
                                        relationsTemp[i].b_sense = tempSense.id;
                                    }
                                }
                                tempSense = result;
                                tempSense.relations = relationsTemp;
                                tempSense.$update({id: tempSense.id}, function (result) {
                                    $scope.sense = tempSense;
                                    $state.go('.', {senseId: tempSense.id}, {relative: $scope.baseState});
                                });
                            }
                        }, function (result) {
                            //Errors
                        });
                    }
                }
            };

            $scope.discardSenseChanges = function () {

            };



            ////////
            // Init
            ////////

            $scope.init = function () {
                if(senseId) {
                    wnwbApi.Sense.get({id: senseId}).$promise.then(function (sense) {
                        $scope.currentSense = sense;
                        lexiconService.setWorkingLexiconId(sense.lexicon);
                        $scope.sense = sense;
                        senseDeferred.resolve(sense);
                    });
                } else {
                    $scope.sense = new wnwbApi.Sense();
                    $scope.sense.id = null;
                    $scope.sense.lexical_entry = {lexicon: lexiconService.getWorkingLexicon().id, part_of_speech: 'n', lemma: ''};
                    $scope.sense.status = 'D';
                    $scope.sense.nr = 0;
                    $scope.sense.sense_definitions = [];
                    $scope.sense.examples = [];
                    $scope.sense.relations = [];
                    $scope.sense.sense_externals = [];
                    $scope.currentSense = $scope.sense;
                    senseDeferred.resolve($scope.sense);
                }
            };

            $q.all([lexiconService.getWorkingLexiconPromise()]).then(function (qAllResults) {
                $scope.init();
            });
    }]);
});