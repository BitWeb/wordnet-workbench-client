define([
    'angularAMD',
    'underscore',
    'TreeViewCtrl',
    'controller/synset/RelationTrees',
    'service/AnchorService',
    'service/LexiconService',
    'service/SynSetRelTypeService',
    'service/SynSetService',
    'service/ExtRelTypeService',
    'service/ExtSystemService',
    'service/DomainService'
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
        'service/DirtyStateService',
        'service/ConfirmModalService',
        'service/AnchorService',
        'service/LexiconService',
        'service/SynSetRelTypeService',
        'service/SynSetService',
        'service/ExtRelTypeService',
        'service/ExtSystemService',
        'service/DomainService',
        'relTypes',
        'extRelTypes',
        'extSystems',
        'domains',
        function (
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $uibModal,
            $log,
            $q,
            wnwbApi,
            dirtyStateService,
            confirmModalService,
            anchorService,
            lexiconService,
            relTypeService,
            synSetService,
            extRelTypeService,
            extSystemService,
            domainService,
            relTypes,
            extRelTypes,
            extSystems,
            domains
        ) {
            if(!$scope.baseState) {
                $scope.baseState = $state.get('synset');
            }
            
            $scope.language = $rootScope.languageCodeMap[$rootScope.language];

            var dirtyStateHandlerUnbind = dirtyStateService.bindHandler($scope.baseState.name, function () {
                var dirtyDeferred = $q.defer();
                var dirtyPromise = dirtyDeferred.promise;
                if(angular.equals($scope.originalSynSet, $scope.currentSynSet)) {
                    dirtyDeferred.resolve(true);
                } else {
                    confirmModalService.open({ok: 'Confirm', text: 'Current synset contains unsaved changes. Are you sure you want to dismiss these changes?'}).then(function(result) {
                        if(result) {
                            dirtyDeferred.resolve(true);
                        } else {
                            dirtyDeferred.resolve(false);
                        }
                    });
                }
                return dirtyPromise;
            });

            // Save propagation
            $scope.childMethodsObj = null;
            if($scope.childMethods) {
                $scope.childMethodsObj = $scope.childMethods;
                var saveFunc = function () {
                    return $scope.saveSynSetPromise();
                };
                $scope.childMethodsObj.propagatedSave = saveFunc;
            }
            $scope.childMethods = {propagatedSave: null};

            $scope.$on('$destroy', function (event) {
                if(dirtyStateHandlerUnbind) {
                    dirtyStateHandlerUnbind();
                }
                if($scope.childMethodsObj) {
                    $scope.childMethodsObj.propagatedSave = null;
                }
            });

            $scope.relTypeList = null;
            $scope.relTypes = relTypes;
            
            $scope.extRelTypes = extRelTypes;
            $scope.extSystems = extSystems;
            $scope.domains = domains;

            relTypeListPromise = relTypeService.getList();

            var synSetDeferred = $q.defer();
            var synSetPromise = synSetDeferred.promise;
            $scope.anchorSynSetPromise = null;

            var synSetId = 0;
            if($stateParams.id) {
                synSetId = $stateParams.id;
            }
            var currentSynSetId = 0;
            if($stateParams.currentSynSetId) {
                currentSynSetId = $stateParams.currentSynSetId;
            }

            $scope.currentSynSet = null;
            $scope.senseList = null;

            $scope.currentDefinition = null;

            $scope.selectedRel = null;

            $scope.relTree = [];



            $scope.setCurrentSynSet = function (synSet) {
                $scope.originalSynSet = angular.copy(synSet);
                $scope.currentSynSet = synSet;
                $scope.senseList = angular.copy(synSet.senses);
            };

            $scope.selectSynsetById = function (synSetId) {
                //TODO: navigate to synset
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

            $scope.currentDefinition = null;
            $scope.tempDef = {};

            $scope.selectDefinition = function (def) {
                $scope.currentDefinition = def;
                if($scope.currentDefinition) {
                    $state.go('synset').then(function () {
                        $state.go('synset.def', {defId: $scope.currentDefinition.id}).then(function () {

                        });
                    });
                }
            };

            $scope.getDefinition = function (definitionId) {
                var deferred = $q.defer();

                if(definitionId) {
                    synSetPromise.then(function (synSet) {
                        var definition = synSetService.getDefinitionById(synSet, definitionId);

                        if(definition) {
                            return $scope.currentDefinition = definition;
                            deferred.resolve(definition);
                        } else {
                            deferred.reject('not found');
                        }
                    });
                } else {
                    if($scope.currentDefinition) {
                        deferred.resolve($scope.currentDefinition);
                    } else {
                        deferred.resolve(null);
                    }
                }

                return deferred.promise;
            };

            $scope.addDefinition = function () {
                $state.go('synset.def');
                $scope.currentDefinition = null;
            };

            $scope.deleteDefinition = function (definition) {
                var index = $scope.currentSynSet.synset_definitions.indexOf(definition);
                if (index > -1) {
                    $scope.currentSynSet.synset_definitions.splice(index, 1);
                }
            };

            $scope.saveDefinition = function (definition) {
                //TODO: validate language

                if($scope.currentDefinition) {
                    angular.copy(definition, $scope.currentDefinition);
                } else {
                    synSetService.addDefinition($scope.currentSynSet, definition);
                }
            };

            $scope.discardDefinition = function () {
                $state.go('synset');
            };

            $scope.setPrimaryDefinition = function (value) {
                synSetService.setPrimaryDefinition($scope.currentSynSet, value);
            };



            //////////////////////////
            // Sense variants methods
            //////////////////////////

            $scope.selectSense = function (sense) {
                $state.go('synset.sense', {senseId: sense.id});
                $scope.currentDefinition = null;
            };

            $scope.removeSense = function (sense) {
                for(k in $scope.senseList) {
                    if($scope.senseList[k].id == sense.id) {
                        $scope.senseList.splice(k, 1);
                    }
                }
            };

            $scope.createSense = function () {
                $state.go('synset.sense', {senseId: null});
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
                        $state.go('synset.sense', {senseId: sense.id});
                    },
                    function (result) {

                    });
            };

            $scope.saveSense = function (sense) {
                $log.log('save sense');
                var listObj = {
                    id: sense.id,
                    label: sense.label,
                    primary_definition: sense.primary_definition,
                    primary_example: sense.primary_example};
                var fFound = false;
                for(var i = 0;i < $scope.senseList.length;i++) {
                    if($scope.senseList[i].id == sense.id) {
                        fFound = true;
                        $scope.senseList[i] = listObj;
                        break;
                    }
                }
                $log.log('saveSense');
                $log.log(fFound);
                if(!fFound) {
                    $scope.senseList.push(listObj);
                }
            };

            $scope.testSenseSelect = function (sense) {
                var fAdd = true;
                for(k in $scope.currentSynSet.senses) {
                    if($scope.currentSynSet.senses[k].id == sense.id) {
                        fAdd = false;
                        break;
                    }
                }
                if(fAdd) {
                    $scope.currentSynSet.senses.push(sense);
                }
            };



            ////////////////////
            // Relation methods
            ////////////////////

            // Populates relation tree view
            $scope.$watchCollection('currentSynSet.relations', function (newValue, oldValue) {
                if(newValue) {

                    $scope.relTree = [
                        {name: 'Directional (outgoing)', type: 'do', nodes: []},
                        {name: 'Directional (incoming)', type: 'di', nodes: []},
                        {name: 'Bidirectional', type: 'bd', nodes: []},
                        {name: 'Non-directional', type: 'nd', nodes: []}
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
                                name: relationsGrouped[k][k2].a_label,
                                type: 'rel',
                                nodes: []
                            };
                            if(relationsGrouped[k][k2].a_synset == $scope.currentSynSet.id) {
                                obj.name = relationsGrouped[k][k2].b_label;
                                nodes_out.push(obj);
                            }
                            if(relationsGrouped[k][k2].b_synset == $scope.currentSynSet.id) {
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
                        $state.go('synset.rel', {relId: relation.id});
                    } else {
                        $state.go('synset').then(function () {
                            $state.go('synset.rel', {relId: null}).then(function () {

                            });
                        });
                    }
                }
            };

            $scope.getRelation = function (relId) {
                var deferred = $q.defer();

                if(relId) {
                    synSetPromise.then(function (synSet) {
                        var fFound = false;
                        for (k in synSet.relations) {
                            if (synSet.relations[k].id == relId) {
                                $scope.selectedRel = synSet.relations[k];
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

                synSetPromise.then(function (synSet) {
                    $log.log('relation list resolve');
                    deferred.resolve($scope.currentSynSet.relations);
                });

                return deferred.promise;
            };

            // Used by RelCtrl to remove existing relations
            $scope.clearRel = function (relId) {
                synSetService.clearRelation($scope.currentSynSet, relId);
            };

            // Used by RelCtrl to create relations
            $scope.setRel = function (source, target, relTypeId) {
                synSetService.setRelation($scope.currentSynSet, source, target, relTypeId);
            };

            $scope.addRel = function (relType, relDir) {
                $scope.selectedRel = null;
                if(relType) {
                    $log.log('set rel type id '+relType.id);
                    $state.go('synset.rel', {relId: null, relTypeId: relType.id, relDir: relDir});
                } else {
                    $state.go('synset.rel', {relId: null});
                }
            };

            $scope.discardRel = function () {
                $state.go('^');
            };

            $scope.saveRel = function (rel, selectedRelType, counterRelType, targetSynSet) {
                $state.go('^');
            };

            $scope.deleteRel = function (relation) {
                if(relation) {
                    synSetService.clearRelation($scope.currentSynSet, relation.id);
                }
            };



            ////////////////////////
            // External ref methods
            ////////////////////////

            $scope.addExtRef = function () {
                var newExtRef = {
                    system: '',
                    sys_id: {},
                    reference: '',
                    type_ref_code: '',
                    rel_type: {}
                };
                $scope.currentSynSet.synset_externals.push(newExtRef);
                $scope.selectedExtRef = newExtRef;
                $scope.tempExtRef = angular.copy(newExtRef);
            };

            $scope.tempExtRef = {};
            $scope.selectedExtRef = null;

            $scope.editExtRef = function (extRef) {
                if($scope.selectedExtRef) {
                    $scope.saveExtRef();
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
                        searchType: function () {return 'synset';},
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

            $scope.selectedExtSystemChanged = function () {
            	$scope.tempExtRef.system = $scope.tempExtRef.sys_id.name;
            };

            $scope.selectedExtRelTypeChanged = function () {
            	$scope.tempExtRef.type_ref_code = $scope.tempExtRef.rel_type.name;
            };

            //////////////////
            // Synset methods
            //////////////////

            $scope.saveSynSet = function () {
                $scope.saveExtRef();

                var savePromise = synSetService.saveSynSet($scope.currentSynSet, $scope.senseList);

                savePromise.then(function (result) {
                    if(result) {
                        $scope.originalSynSet = angular.copy($scope.currentSynSet);
                    }
                });

                return savePromise;
            };

            $scope.saveSynSetPromise = function () {
                var d = $q.defer();
                var p = d.promise;

                var childPromise = null;
                if($scope.childMethods.propagatedSave && $scope.childMethods.propagatedSave) {
                    childPromise = $scope.childMethods.propagatedSave();
                }

                if(!childPromise) {
                    childPromise = $q.when(true);
                }
                childPromise.then(function (fChildrenSaved) {
                    var fValid = true;

                    /*if(!$scope.validateSynset($scope.sense) || !fChildrenSaved) {
                        fValid = false;
                    }*/

                    if(fChildrenSaved && fValid) {
                        $scope.saveSynSet().then(function (synSetResult) {
                            d.resolve(synSetResult);
                        });
                    } else {
                        d.resolve(false);
                    }
                });

                return p;
            };

            $scope.saveSynSetAction = function () {
                $scope.saveSynSetPromise().then(function (synSetResult) {
                    if(synSetResult) {
                        if($scope.currentSynSet.id) {

                            //TODO: check, reload?
                            synSetPromise = wnwbApi.SynSet.get({id: $scope.currentSynSet.id}).$promise;
                            $scope.synSetPromise = synSetPromise;
                            synSetPromise.then(function (synSet) {
                                $scope.setCurrentSynSet(synSet);
                                anchorService.pushSynSet(synSet);
                            });
                        } else {
                            $state.go('synset', {id: synSetResult.id});
                        }
                    }
                });
            };

            $scope.discardSynSetChanges = function () {
                //new synset -- reload
                //editing -- reload??? anchor
                    //not editing anchor? -- change current synset

                //always reload anchor (relations change)

                console.log('discard', $scope.anchorSynSet, $scope.currentSynSet);
                if($scope.anchorSynSet && $scope.currentSynSet) {
                    console.log('xxxxxxxxxxx', $scope.currentSynSet.id);
                    $state.go($scope.baseState, {id: $scope.anchorSynSet.id, currentSynSetId: $scope.currentSynSet.id}, {reload: $scope.baseState});
                } else {
                    $state.go($scope.baseState.name, null, {reload: $scope.baseState});
                }
            };

            $scope.deleteSynSet = function () {
                console.log('delete', $scope.anchorSynSet, $scope.currentSynSet);
                if($scope.currentSynSet.id) {
                	wnwbApi.SynSet.remove({id: $scope.currentSynSet.id});
                	anchorService.popSynSet($scope.currentSynSet);
                    $scope.synSetPromise = null;
                    $scope.currentSynSet = null;
                    $scope.originalSynSet = null;
                }
                $state.go($scope.baseState.name, null, {reload: $scope.baseState});
            };

            ////////
            // Init
            ////////

            $scope.init = function () {
                var anchorDeferred = $q.defer();
                $scope.anchorSynSetPromise = anchorDeferred.promise;

                if(synSetId) {
                    wnwbApi.SynSet.get({id: synSetId}).$promise.then(function (synSet) {
                        console.log('......................currentSynSetId', currentSynSetId);
                        if(currentSynSetId) {
                            wnwbApi.SynSet.get({id: currentSynSetId}).$promise.then(function (currentSynSet) {
                                $rootScope.currentSynSetId = currentSynSetId;
                                synSetDeferred.resolve(currentSynSet);
                                $scope.setCurrentSynSet(currentSynSet);
                            });
                        } else {
                            $rootScope.currentSynSetId = synSet.id;
                            var currentSynSet = synSet;
                            synSetDeferred.resolve(currentSynSet);
                            $scope.setCurrentSynSet(currentSynSet);
                        }
                        $scope.anchorSynSet = synSet;
                        anchorService.pushSynSet(synSet);
                        lexiconService.setWorkingLexiconId(synSet.lexicon);
                        anchorDeferred.resolve(synSet);
                    });
                } else {
                    var synSet = new wnwbApi.SynSet();
                    synSet.label = '?';
                    synSet.lexicon = lexiconService.getWorkingLexicon().id;
                    synSet.synset_type = 'C';
                    synSet.status = 'D';
                    synSet.synset_definitions = [];
                    synSet.relations = [];
                    synSet.senses = [];
                    synSet.synset_externals = [];

                    $scope.anchorSynSet = synSet;

                    $scope.setCurrentSynSet(synSet);

                    synSetDeferred.resolve(synSet);
                }
            };

            $q.all([lexiconService.getWorkingLexiconPromise(), relTypeListPromise]).then(function (qAllResults) {
                $scope.init();
            });
        }
    ]);
});