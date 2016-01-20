/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate',
    'service/LexiconService',
    'service/SenseRelTypeService'
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
            relTypes)
        {

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

            $scope.selectedDefinition = null;
            $scope.tempDef = {};
            $scope.selectDefinition = function (def) {
                $scope.selectedDefinition = def;
                if($scope.selectedDefinition) {
                    $state.go('.def', {senseId: $scope.sense.id, defId: $scope.selectedDefinition.id}).then(function () {

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
                    deferred.resolve(null);
                }

                return deferred.promise;
            };

            $scope.addDefinition = function () {
                $state.go('.def');
                $scope.selectedDefinition = {statements: []};
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

            $scope.saveDefinition = function (def) {
                if(def.id) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    $scope.currentSense.sense_definitions.push(angular.copy(def));
                }
            };



            /////////////////////////
            // Sense example methods
            /////////////////////////

            $scope.addExample = function () {
                var newExample = {
                    text: '',
                    language: '',
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
                }
                $scope.tempExample = angular.copy(example);
                $scope.tempExample.language = $scope.languageCodeMap[$scope.tempExample.language];
                $scope.selectedExample = example;
            };

            $scope.saveExample = function () {
                angular.copy($scope.tempExample, $scope.selectedExample);

                if($scope.selectedExample.language.code) {
                    $scope.selectedExample.language = $scope.tempExample.language.code;
                } else {
                    $scope.selectedExample.language = null;
                }
                $scope.cancelExample();
            };

            $scope.cancelExample = function () {
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

            $scope.$watchCollection('sense.relations', function (newValue, oldValue) {
                if(newValue) {

                    $scope.relTree = [
                        {name: 'Directional (outgoing)', nodes: []},
                        {name: 'Directional (incoming)', nodes: []},
                        {name: 'Bidirectional', nodes: []},
                        {name: 'Non-directional', nodes: []}
                    ];

                    var relationsGrouped = _.groupBy($scope.currentSense.relations, function (item) {
                        return item.rel_type;
                    });

                    for(k in relationsGrouped) {
                        var relType = relTypeService.getById(k);
                        if(!relType) {
                            $log.log('relType null');
                            $log.log($scope.currentSense.relations);
                            $log.log(relationsGrouped);
                            $log.log(k);
                        }
                        var nodes_out = [];
                        var nodes_in = [];
                        for(k2 in relationsGrouped[k]) {
                            var obj = {
                                rel: relationsGrouped[k][k2],
                                name: relationsGrouped[k][k2].targetlabel,
                                nodes: []
                            };
                            if(relationsGrouped[k][k2].a_sense == $scope.currentSense.id) {
                                nodes_out.push(obj);
                            }
                            if(relationsGrouped[k][k2].b_sense == $scope.currentSense.id) {
                                nodes_in.push(obj);
                            }
                        }
                        if(relType.direction == 'd') {
                            $scope.relTree[0].nodes.push({
                                name: relType.name,
                                nodes: nodes_out
                            });
                            $scope.relTree[1].nodes.push({
                                name: relType.name,
                                nodes: nodes_in
                            });
                        }
                        if(relType.direction == 'b') {
                            $scope.relTree[2].nodes.push({
                                name: relType.name,
                                nodes: _.union(nodes_in, nodes_out)
                            });
                        }
                        if(relType.direction == 'n') {
                            $scope.relTree[3].nodes.push({
                                name: relType.name,
                                nodes: _.union(nodes_in, nodes_out)
                            });
                        }
                    }
                }
            });

            $scope.getRelation = function (relId) {
                var deferred = $q.defer();

                if(relId) {
                    sensePromise.then(function (sense) {
                        var fFound = false;
                        for (k in sense.relations) {
                            if (sense.relations[k].id == relId) {
                                $scope.selectedRelation = sense.relations[k];
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
                    deferred.resolve(null);
                }

                return deferred.promise;
            };

            $scope.getRelationList = function () {
                var deferred = $q.defer();

                sensePromise.then(function (sense) {
                    deferred.resolve($scope.currentSense.relations);
                });

                return deferred.promise;
            };

            $scope.addRel = function () {
                if($scope.currentSynSet !== undefined) {
                    $state.go('synset.sense.rel', {relId: null});
                } else {
                    $state.go('sense.rel', {relId: null});
                }
            };

            $scope.selectRel = function (relation) {
                $log.log('relation selected');
                if($scope.currentSynSet !== undefined) {
                    $log.log('relation selected');
                    $log.log(relation);
                    $state.go('synset.sense.rel', {relId: relation.id});
                } else {
                    $state.go('sense.rel', {relId: relation.id});
                }
            };

            $scope.discardRel = function () {
                $state.go('^');
            };

            $scope.saveRel = function (rel, selectedRelType, counterRelType, targetSense) {


                $state.go('^');
            };

            $scope.deleteRel = function (relation) {

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

            $scope.saveSense = function () {
                $scope.saveExtRef();
                if($scope.sense.id) {
                    if($scope.currentSynSet !== undefined) {
                        $scope.sense.synset = $scope.currentSynSet.id;
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
                                $state.go('.', {id: $scope.sense.id});
                            });
                        });
                    }
                } else {
                    $scope.sense.lexical_entry.lexicon = lexiconService.getWorkingLexicon().id;
                    if($scope.currentSynSet !== undefined) {
                        $scope.sense.synset = $scope.currentSynSet.id;
                        $scope.sense.$save(function (result) {
                            $scope.sense = result;
                            $scope.$parent.saveSense($scope.sense);
                            $state.go('^', {senseId: $scope.sense.id});
                        });
                    } else {
                        $scope.sense.$save(function (result) {
                            $scope.sense = result;
                            $state.go('.', {id: $scope.sense.id});
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
                    $scope.sense.lexical_entry = {lexicon: lexiconService.getWorkingLexicon().id, part_of_speech: 'n', lemma: ''};
                    $scope.sense.status = 'D';
                    $scope.sense.nr = 1;
                    $scope.sense.sense_definitions = [];
                    $scope.sense.examples = [];
                    $scope.sense.relations = [];
                    $scope.sense.sense_externals = [];
                }
            };

            $q.all([lexiconService.getWorkingLexiconPromise()]).then(function (qAllResults) {
                $scope.init();
            });
    }]);
});