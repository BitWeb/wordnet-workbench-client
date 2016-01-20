define([
    'angularAMD',
    'underscore',
    'TreeViewCtrl',
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
            $scope.relTypeMap = null;



            var synSetPromise = null;
            var relTypeListPromise = null;
            var relTypeMapPromise = null;

            relTypeListPromise = relTypeService.getList();

            relTypeListPromise.then(function (response) {
                /*$scope.relTypes = [];

                angular.forEach(relTypes, function (value, key) {
                    $scope.relTypes.push(value);
                    value.children = [];
                    $scope.relTypeMap[value.id] = value;
                });

                for(k in $scope.relTypes) {
                    if($scope.relTypeMap[$scope.relTypes[k].other]) {
                        $scope.relTypeMap[$scope.relTypes[k].other].children.push($scope.relTypes[k]);
                    }
                }*/
            });



            $scope.sensesToAdd = {};
            $scope.sensesToRem = {};

            var synsetId = 0;
            if($stateParams.id) {
                synsetId = $stateParams.id;
            }

            var relId = 0;
            if($stateParams.relId !== null) {
                relId = $stateParams.relId;
            }

            $scope.selectedDefinition = null;

            $scope.selectedRel = null;

            $scope.relTree = [];

            if(synsetId) {
                synSetPromise = wnwbApi.SynSet.get({id: synsetId}).$promise;
                $log.log(synSet);
                synSetPromise.then(function (synSet) {
                    $scope.synSet = synSet;
                    AnchorService.pushSynSet(synSet);
                    lexiconService.setWorkingLexiconId(synSet.lexicon);
                });
            } else {
                console.log('no synset id');
                //TODO: set working lexicon on saving

                var synSet = new wnwbApi.SynSet();
                synSet.label = 'test label';
                synSet.lexicon = null;
                synSet.status = 'D';
                synSet.synset_definitions = [];
                synSet.relations = [];
                synSet.synset_externals = [];

                $scope.synSet = synSet;
            }

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
                    $state.go('synset.def', {id: $scope.synSet.id, defId: $scope.selectedDefinition.id}).then(function () {
                        $log.log('broadcast def loaded 1');
                        //$scope.$broadcast('definition-loaded', $scope.selectedDefinition);
                    });
                }
            };

            //TODO: update selected def?
            $scope.getDefinition = function (definitionId) {
                var deferred = $q.defer();

                synSetPromise.then(function (synSet) {
                    var fFound = false;
                    for(k in synSet.synset_definitions) {
                        if(synSet.synset_definitions[k].id == definitionId) {
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
                $state.go('synset.def', {id: $scope.synSet.id});
                $scope.selectedDefinition = {statements: []};
                //console.log('broadcast def loaded 2');
                $scope.$broadcast('definition-loaded', $scope.selectedDefinition);
            };

            $scope.deleteDefinition = function (definition) {
                var index = $scope.synSet.synset_definitions.indexOf(definition);
                if (index > -1) {
                    $scope.synSet.synset_definitions.splice(index, 1);
                }
            };

            $scope.discardDefinition = function () {
                $state.go('synset');
            };

            $scope.saveDefinition = function (newDef) {
                if(newDef.id) {
                    angular.copy(newDef, $scope.selectedDefinition);
                } else {
                    $scope.synSet.synset_definitions.push(angular.copy(newDef));
                }
                $state.go('synset');
            };



            //////////////////////////
            // Sense variants methods
            //////////////////////////

            $scope.selectSense = function (sense) {
                $state.go('synset.sense', {senseId: sense.id});
                $scope.selectedDefinition = null;
                $scope.$broadcast('synset-loaded', $scope.synSet);
            };

            $scope.removeSense = function (sense) {
                delete $scope.sensesToAdd[sense.id];
                $scope.sensesToRem[sense.id] = sense;
                for(k in $scope.synSet.senses) {
                    if($scope.synSet.senses[k].id == sense.id) {
                        $scope.synSet.senses.splice(k, 1);
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
                        searchType: function () {return 'sense';}
                    }
                }).result.then(function (sense) {
                        //$scope.synSet.senses.push({id: sense.id, label: sense.label});
                        $state.go('.sense', {senseId: sense.id});
                        //set synset
                            //what about new synset?
                            //iterate over synset senses and PUT each sense
                    },
                    function (result) {

                    });
            };

            $scope.saveSense = function (sense) {

            };

            $scope.testSenseSelect = function (sense) {
                var fAdd = true;
                for(k in $scope.synSet.senses) {
                    if($scope.synSet.senses[k].id == sense.id) {
                        fAdd = false;
                        break;
                    }
                }
                if(fAdd) {
                    delete $scope.sensesToRem[sense.id];
                    $scope.sensesToAdd[sense.id] = sense;
                    $scope.synSet.senses.push(sense);
                }
            };



            ////////////////////
            // Relation methods
            ////////////////////

            $scope.$watchCollection('synSet.relations', function (newValue, oldValue) {
                if(newValue) {

                    $scope.relTree = [
                        {name: 'Directional (outgoing)', nodes: []},
                        {name: 'Directional (incoming)', nodes: []},
                        {name: 'Bidirectional', nodes: []},
                        {name: 'Non-directional', nodes: []}
                    ];

                    var relationsGrouped = _.groupBy($scope.synSet.relations, function (item) {
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
                            if(relationsGrouped[k][k2].a_synset == $scope.synSet.id) {
                                nodes_out.push(obj);
                            }
                            if(relationsGrouped[k][k2].b_synset == $scope.synSet.id) {
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

            $scope.requestRel = function (relId, callback) {
                if(relId) {
                    var unregister = $scope.$watch('synSet', function(newValue, oldValue) {
                        if(newValue) {
                            //console.log(newValue);
                            for (k in $scope.synSet.relations) {
                                if ($scope.synSet.relations[k].id == relId) {
                                    $scope.selectedRel = $scope.synSet.relations[k];
                                    break;
                                }
                            }
                            var rel = {};
                            if($scope.selectedRel) {
                                rel.id = $scope.selectedRel.id;
                                rel.a_synset = $scope.selectedRel.a_synset; //source
                                rel.b_synset = $scope.selectedRel.b_synset; //target
                                rel.rel_type = $scope.selectedRel.rel_type; //type
                                rel.targetlabel = $scope.selectedRel.targetlabel; //target synset label
                            }
                            //Get counter
                            var relType = $scope.relTypeMap[rel.rel_type]; //rel type

                            callback(rel);
                            unregister();
                        }
                    });
                }
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

                console.log('saveRel start');

                if(rel.type) {
                    var synSetRel = {
                        a_synset: $scope.synSet.id,
                        b_synset: targetSynSet.id,
                        rel_type: rel.type.id,
                        targetlabel: targetSynSet.label
                    };
                    $scope.synSet.relations.push(synSetRel);

                    console.log(synSetRel);
                }
                if(counterRel.type) {
                    var synSetRel = {
                        a_synset: targetSynSet.id,
                        b_synset: $scope.synSet.id,
                        rel_type: counterRel.type.id,
                        targetlabel: targetSynSet.label
                    };
                    $scope.synSet.relations.push(synSetRel);

                    console.log(synSetRel);
                }
                console.log('saveRel done');

                $state.go('^');
            };

            $scope.deleteRel = function (relation) {

            };



            //////////////////
            // Synset methods
            //////////////////

            $scope.saveSynSet = function () {
                if($scope.synSet.id) {
                    $scope.synSet.$update({id: $scope.synSet.id}, function () {
                        for(k in $scope.sensesToRem) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToRem[k].id}, function () {
                                sense.synset = 0;
                                sense.$update({id: sense.id});
                            });
                        }
                        for(k in $scope.sensesToAdd) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToAdd[k].id}, function () {
                                sense.synset = $scope.synSet.id;
                                sense.$update({id: sense.id});
                            });
                        }
                    });
                } else {
                    var result = $scope.synSet.$save(function () {
                        for(k in $scope.sensesToRem) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToRem[k].id}, function () {
                                sense.synset = 0;
                                sense.$update({id: sense.id});
                            });
                        }
                        for(k in $scope.sensesToAdd) {
                            var sense = wnwbApi.Sense.get({id: $scope.sensesToAdd[k].id}, function () {
                                sense.synset = $scope.synSet.id;
                                sense.$update({id: sense.id});
                            });
                        }
                        $state.go('synset', {id: $scope.synSet.id});
                    });
                }
            };

            $scope.discardSynSetChanges = function () {

            };
        }
    ]);
});