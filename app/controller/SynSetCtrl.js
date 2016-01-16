define([
    'angularAMD',
    'underscore',
    'TreeViewCtrl',
    'controller/synset/RelationTrees',
    'service/AnchorService',
    'service/LexiconService',
    'service/SynSetRelTypeService'
], function (angularAMD) {

    angularAMD.controller('SynSetCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$uibModal',
        '$log',
        '$q',
        'wnwbApi',
        'service/AnchorService',
        'service/LexiconService',
        'service/SynSetRelTypeService',
        function (
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $uibModal,
            $log,
            $q,
            wnwbApi,
            AnchorService,
            lexiconService,
            relTypeService
        ) {

            $scope.relTypeList = null;
            relTypeListPromise = relTypeService.getList();

            var synSetPromise = null;
            $scope.anchorSynSetPromise = null;

            var synSetId = 0;
            if($stateParams.id) {
                synSetId = $stateParams.id;
            }

            $scope.currentSynSet = null;

            $scope.sensesToAdd = {};
            $scope.sensesToRem = {};

            $scope.selectedDefinition = null;

            $scope.selectedRel = null;

            $scope.relTree = [];



            $scope.setCurrentSynSet = function (synSet) {
                $scope.sensesToAdd = {};
                $scope.sensesToRem = {};
                $scope.currentSynSet = synSet;
            };

            $scope.selectSynset = function (synSetId) {
                $log.log('selectSynset '+synSetId);
                $state.go('synset', {id: $scope.anchorSynSet.id});
                synSetPromise = wnwbApi.SynSet.get({id: synSetId}).$promise;
                $scope.synSetPromise = synSetPromise;
                synSetPromise.then(function (synSet) {
                    $scope.setCurrentSynSet(synSet);
                });
            };

            $scope.selectTab = function (tabName) {
                //change controller
            };



            //////////////////////
            // Definition methods
            //////////////////////

            $scope.selectedDefinition = null;
            $scope.tempDef = {};
            $scope.selectDefinition = function (def) {
                $log.log('Select definition');
                $scope.selectedDefinition = def;
                if($scope.selectedDefinition) {
                    $state.go('synset.def', {id: $scope.anchorSynSet.id, defId: $scope.selectedDefinition.id}).then(function () {
                        $log.log('broadcast def loaded 1');
                        //$scope.$broadcast('definition-loaded', $scope.selectedDefinition);
                    });
                }
            };

            $scope.getDefinition = function (definitionId) {
                var deferred = $q.defer();

                synSetPromise.then(function (synSet) {
                    $log.log('get definition');
                    var fFound = false;
                    for(k in synSet.synset_definitions) {
                        if(synSet.synset_definitions[k].id == definitionId) {
                            $scope.selectedDefinition = synSet.synset_definitions[k];
                            deferred.resolve(synSet.synset_definitions[k]);
                            fFound = true;
                            break;
                        }
                    }
                    if(fFound) {
                        deferred.reject('not found');
                    }
                });

                return deferred.promise;
            };

            $scope.addDefinition = function () {
                $state.go('synset.def', {id: $scope.anchorSynSet.id});
                $scope.selectedDefinition = {statements: []};
                //console.log('broadcast def loaded 2');
                $scope.$broadcast('definition-loaded', $scope.selectedDefinition);
            };

            $scope.deleteDefinition = function (definition) {
                var index = $scope.anchorSynSet.synset_definitions.indexOf(definition);
                if (index > -1) {
                    $scope.anchorSynSet.synset_definitions.splice(index, 1);
                }
            };

            $scope.discardDefinition = function () {
                $state.go('synset');
            };

            $scope.saveDefinition = function (def) {
                if(def.id) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    $scope.anchorSynSet.synset_definitions.push(angular.copy(def));
                }
            };



            //////////////////////////
            // Sense variants methods
            //////////////////////////

            $scope.selectSense = function (sense) {
                $state.go('synset.sense', {senseId: sense.id});
                $scope.selectedDefinition = null;
                $scope.$broadcast('synset-loaded', $scope.anchorSynSet);
            };

            $scope.removeSense = function (sense) {
                delete $scope.sensesToAdd[sense.id];
                $scope.sensesToRem[sense.id] = sense;
                for(k in $scope.anchorSynSet.senses) {
                    if($scope.anchorSynSet.senses[k].id == sense.id) {
                        $scope.anchorSynSet.senses.splice(k, 1);
                    }
                }
            };

            $scope.createSense = function () {
                $state.go('synset.sense');
            };

            $scope.addSense = function () {
                return $uibModal.open({
                    templateUrl: 'view/main/literalSerachModal.html',
                    scope: $scope,
                    controller: 'main/literalSearchCtrl',
                    resolve: {
                        searchType: function () {return 'sense';},
                        lexiconMode: function () {return null;}
                    }
                }).result.then(function (sense) {
                        //$scope.anchorSynSet.senses.push({id: sense.id, label: sense.label});
                        $state.go('.sense', {senseId: sense.id});
                        //set synset
                            //what about new synset?
                            //iterate over synset senses and PUT each sense
                    },
                    function (result) {

                    });
            };

            $scope.saveSense = function (sense) {
                //TODO: Set sense synset
            };

            $scope.testSenseSelect = function (sense) {
                var fAdd = true;
                for(k in $scope.anchorSynSet.senses) {
                    if($scope.anchorSynSet.senses[k].id == sense.id) {
                        fAdd = false;
                        break;
                    }
                }
                if(fAdd) {
                    delete $scope.sensesToRem[sense.id];
                    $scope.sensesToAdd[sense.id] = sense;
                    $scope.anchorSynSet.senses.push(sense);
                }
            };



            ////////////////////
            // Relation methods
            ////////////////////

            $scope.$watchCollection('currentSynSet.relations', function (newValue, oldValue) {
                if(newValue) {

                    $scope.relTree = [
                        {name: 'Directional (outgoing)', nodes: []},
                        {name: 'Directional (incoming)', nodes: []},
                        {name: 'Bidirectional', nodes: []},
                        {name: 'Non-directional', nodes: []}
                    ];

                    var relationsGrouped = _.groupBy($scope.currentSynSet.relations, function (item) {
                        return item.rel_type;
                    });

                    for(k in relationsGrouped) {
                        var relType = relTypeService.getById(k);
                        var nodes_out = [];
                        var nodes_in = [];
                        for(k2 in relationsGrouped[k]) {
                            var obj = {
                                rel: relationsGrouped[k][k2],
                                name: relationsGrouped[k][k2].targetlabel,
                                nodes: []
                            };
                            if(relationsGrouped[k][k2].a_synset == $scope.currentSynSet.id) {
                                nodes_out.push(obj);
                            }
                            if(relationsGrouped[k][k2].b_synset == $scope.currentSynSet.id) {
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
                    synSetPromise.then(function (synSet) {
                        var fFound = false;
                        for (k in synSet.relations) {
                            if (synSet.relations[k].id == relId) {
                                $scope.selectedRelation = synSet.relations[k];
                                deferred.resolve(synSet.relations[k]);
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

            $scope.addRel = function () {
                $state.go('synset.rel', {relId: null});
            };

            $scope.selectRel = function (relation) {
                console.log('selectRel');
                console.log(relation);
                $state.go('synset.rel', {relId: relation.id});
            };

            $scope.discardRel = function () {
                $state.go('^');
            };

            $scope.saveRel = function (rel, counterRel, targetSynSet) {
                if(rel.type) {
                    var synSetRel = {
                        a_synset: $scope.anchorSynSet.id,
                        b_synset: targetSynSet.id,
                        rel_type: rel.type.id,
                        targetlabel: targetSynSet.label
                    };
                    $scope.anchorSynSet.relations.push(synSetRel);

                    console.log(synSetRel);
                }
                if(counterRel.type) {
                    var synSetRel = {
                        a_synset: targetSynSet.id,
                        b_synset: $scope.anchorSynSet.id,
                        rel_type: counterRel.type.id,
                        targetlabel: targetSynSet.label
                    };
                    $scope.anchorSynSet.relations.push(synSetRel);

                    console.log(synSetRel);
                }
                console.log('saveRel done');

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
                $scope.currentSynSet.synset_externals.push(newExtRef);
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
                angular.copy($scope.tempExtRef, $scope.selectedExtRef);
                $scope.cancelExtRef();
            };

            $scope.cancelExtRef = function () {
                $scope.selectedExtRef = null;
            };

            $scope.deleteExtRef = function (extRef) {
                var index = $scope.currentSynSet.synset_externals.indexOf(extRef);
                if (index > -1) {
                    $scope.currentSynSet.synset_externals.splice(index, 1);
                }
            };

            $scope.setExtRefKey = function (extRef) {
                return $uibModal.open({
                    templateUrl: 'view/main/literalSerachModal.html',
                    scope: $scope,
                    controller: 'main/literalSearchCtrl',
                    resolve: {
                        searchType: function () {return 'synset ext ref';},
                        lexiconMode: function () {return 'any';}
                    }
                }).result.then(function (synSet) {
                        if(synSet) {
                            $scope.tempExtRef.reference = synSet.id;
                        }
                    },
                    function (result) {

                    });
            };



            //////////////////
            // Synset methods
            //////////////////

            $scope.saveSynSet = function () {
                if($scope.currentSynSet.id) {
                    var tempSynSet = angular.copy($scope.currentSynSet);
                    tempSynSet.$update({id: $scope.currentSynSet.id}, function () {
                        for(k in $scope.sensesToRem) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToRem[k].id}, function () {
                                sense.synset = 0;
                                sense.$update({id: sense.id});
                            });
                        }
                        for(k in $scope.sensesToAdd) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToAdd[k].id}, function () {
                                sense.synset = $scope.currentSynSet.id;
                                sense.$update({id: sense.id});
                            });
                        }
                    }).then(function () {
                        synSetPromise = wnwbApi.SynSet.get({id: $scope.currentSynSet.id}).$promise;
                        $scope.synSetPromise = synSetPromise;
                        synSetPromise.then(function (synSet) {
                            $scope.setCurrentSynSet(synSet);
                        });
                    });
                } else {
                    var result = $scope.currentSynSet.$save(function () {
                        for(k in $scope.sensesToRem) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToRem[k].id}, function () {
                                sense.synset = 0;
                                sense.$update({id: sense.id});
                            });
                        }
                        for(k in $scope.sensesToAdd) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToAdd[k].id}, function () {
                                sense.synset = $scope.currentSynSet.id;
                                sense.$update({id: sense.id});
                            });
                        }
                        $state.go('synset', {id: $scope.currentSynSet.id});
                    });
                }
            };

            $scope.discardSynSetChanges = function () {

            };



            ////////
            // Init
            ////////

            $scope.init = function () {
                if(synSetId) {
                    $scope.anchorSynSetPromise = wnwbApi.SynSet.get({id: synSetId}).$promise;
                    synSetPromise = $scope.anchorSynSetPromise;

                    $scope.anchorSynSetPromise.then(function (synSet) {
                        $scope.anchorSynSet = synSet;
                        AnchorService.pushSynSet(synSet);
                        lexiconService.setWorkingLexiconId(synSet.lexicon);
                        $scope.setCurrentSynSet(synSet);
                    });
                } else {
                    var synSet = new wnwbApi.SynSet();
                    synSet.label = 'test label';
                    synSet.lexicon = lexiconService.getWorkingLexicon().id;
                    synSet.status = 'D';
                    synSet.synset_definitions = [];
                    synSet.relations = [];
                    synSet.synset_externals = [];

                    $scope.anchorSynSet = synSet;
                    $scope.currentSynSet = synSet;
                }
            };

            $q.all([lexiconService.getWorkingLexiconPromise()]).then(function (qAllResults) {
                $scope.init();
            });
        }
    ]);
});