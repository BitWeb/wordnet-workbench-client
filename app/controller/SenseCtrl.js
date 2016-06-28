/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate',
    'service/DirtyStateService',
    'service/ConfirmModalService',
    'service/AnchorService',
    'service/LexiconService',
    'service/SenseRelTypeService',
    'service/SenseService',
    'service/SenseStyleService',
    'service/ExtRelTypeService',
    'service/ExtSystemService'
], function (angularAMD) {

    angularAMD.controller('SenseCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$q',
        '$log',
        '$uibModal',
        'wnwbApi',
        '$animate',
        'service/DirtyStateService',
        'service/ConfirmModalService',
        'service/AnchorService',
        'service/LexiconService',
        'service/SenseRelTypeService',
        'service/SenseService',
        'service/SenseStyleService',
        'service/ExtRelTypeService',
        'service/ExtSystemService',
        'relTypes',
        'senseStyles',
        'extRelTypes',
        'extSystems',
        function (
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $q,
            $log,
            $uibModal,
            wnwbApi,
            $animate,
            dirtyStateService,
            confirmModalService,
            anchorService,
            lexiconService,
            relTypeService,
            senseService,
            senseStyleService,
            extRelTypeService,
            extSystemService,
            relTypes,
            senseStyles,
            extRelTypes,
            extSystems
            )
        {
            if(!$scope.baseState) {
                $scope.baseState = $state.get('sense');
            } else {
                $scope.baseState = $state.get($scope.baseState.name+'.sense');
            }

            var dirtyStateHandlerUnbind = dirtyStateService.bindHandler($scope.baseState.name, function () {
                var dirtyDeferred = $q.defer();
                var dirtyPromise = dirtyDeferred.promise;
                if(angular.equals($scope.originalSense, $scope.currentSense)) {
                    dirtyDeferred.resolve(true);
                } else {
                    confirmModalService.open({ok: 'Confirm', text: 'Current sense contains unsaved changes. Are you sure you want to dismiss these changes?'}).then(function(result) {
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
                    return $scope.saveSensePromise();
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

            var senseDeferred = $q.defer();
            var sensePromise = senseDeferred.promise;

            var senseId = 0;
            if($stateParams.senseId) {
                senseId = $stateParams.senseId;
            }

            $scope.relTypes = relTypes;
            $scope.extRelTypes = extRelTypes;
            $scope.extSystems = extSystems;
            $scope.senseStyles = senseStyles;

            $scope.sense = {};
            $scope.currentSense = {};
            $scope.originalSense = {};
            $scope.fIsDirty = false;

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
                console.log('save definition');
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
                    $state.go('.rel', {relId: null, relTypeId: relType.id, relDir: relDir}, {relative: $scope.baseState});
                } else {
                    $state.go('.rel', {relId: null}, {relative: $scope.baseState});
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
                        sys_id: {},
                        reference: '',
                        type_ref_code: '',
                        rel_type: {}
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

            $scope.selectedExtSystemChanged = function () {
            	$scope.tempExtRef.system = $scope.tempExtRef.sys_id.name;
            };

            $scope.selectedExtRelTypeChanged = function () {
            	$scope.tempExtRef.type_ref_code = $scope.tempExtRef.rel_type.name;
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
                var d = $q.defer();
                var p = d.promise;

                $scope.saveAll();

                if($scope.sense.id) {
                    if($scope.currentSynSet !== undefined) {
                        $scope.sense.$update({id: $scope.sense.id}, function () {
                            wnwbApi.Sense.get({id: senseId}, function (result) {
                                $scope.sense = result;
                                $scope.currentSense = $scope.sense;
                                $scope.originalSense = angular.copy($scope.currentSense);
                                $scope.$parent.saveSense($scope.sense);
                                d.resolve(true);
                            });
                        });
                    } else {
                        $scope.sense.$update({id: $scope.sense.id}, function () {
                            wnwbApi.Sense.get({id: senseId}, function (result) {
                                $scope.sense = result;
                                $scope.currentSense = $scope.sense;
                                $scope.originalSense = angular.copy($scope.currentSense);
                                d.resolve(true);
                            });
                        });
                    }
                } else {
                    $scope.sense.lexical_entry.lexicon = lexiconService.getWorkingLexicon().id;
                    if($scope.currentSynSet !== undefined) {
                        var tempSense = angular.copy($scope.sense);
                        var relationsTemp = tempSense.relations;
                        console.log('relationsTemp', relationsTemp);
                        tempSense.relations = [];
                        tempSense.$save(function (result) {
                            console.log('save success', tempSense, result);
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
                                    $scope.currentSense = $scope.sense;
                                    $scope.originalSense = angular.copy($scope.currentSense);
                                    $scope.$parent.saveSense($scope.sense);
                                    d.resolve(true);
                                });
                            }
                        }, function (result) {
                            //Errors
                            d.resolve(false);
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
                                    $scope.currentSense = $scope.sense;
                                    $scope.originalSense = angular.copy($scope.currentSense);
                                    d.resolve(true);
                                });
                            }
                        }, function (result) {
                            //Errors
                            d.resolve(false);
                        });
                    }
                }
                return p;
            };

            $scope.saveSensePromise = function () {
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

                    if(!$scope.validateSense($scope.sense) || !fChildrenSaved) {
                        fValid = false;
                    }

                    if(fChildrenSaved && fValid) {
                        $scope.saveSense().then(function () {
                            d.resolve(true);
                        });
                    } else {
                        d.resolve(false);
                    }
                });

                return p;
            };

            $scope.saveAction = function () {
                $scope.saveSensePromise().then(function (fSaved) {
                    if(fSaved) {
                        if($scope.currentSynSet !== undefined) {
                            $state.go('^', {senseId: $scope.sense.id});
                        } else {
                            $state.go('.', {senseId: $scope.sense.id}, {relative: $scope.baseState});
                        }
                    }
                });
            };

            $scope.discardSenseChanges = function () {
                if($scope.baseState.name == 'sense') {
                    $state.go($scope.baseState, null,{reload: $scope.baseState});
                } else {
                    $state.go('^');
                }
            };



            ////////
            // Init
            ////////

            $scope.init = function () {
                if(senseId) {
                    wnwbApi.Sense.get({id: senseId}).$promise.then(function (sense) {
                        $scope.currentSense = sense;
                        if($scope.baseState.name == 'sense') {
                            anchorService.pushSense(sense);
                        }
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

            sensePromise.then(function () {
                $scope.originalSense = angular.copy($scope.currentSense);
            });
    }]);
});