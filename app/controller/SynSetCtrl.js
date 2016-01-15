define([
    'angularAMD',
    'underscore',
    'TreeViewCtrl',
    'service/AnchorService'
], function (angularAMD) {

    angularAMD.controller('SynSetCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$uibModal',
        'wnwbApi',
        'service/AnchorService', function (
            $scope,
            $state,
            $stateParams,
            $uibModal,
            wnwbApi,
            AnchorService) {

        $scope.relTypeMap = {};

        var relTypes = wnwbApi.SynSetRelType.query(function (response) {
            $scope.relTypes = [];

            angular.forEach(relTypes, function (value, key) {
                $scope.relTypes.push(value);
                value.children = [];
                $scope.relTypeMap[value.id] = value;
            });

            for(k in $scope.relTypes) {
                if($scope.relTypeMap[$scope.relTypes[k].other]) {
                    $scope.relTypeMap[$scope.relTypes[k].other].children.push($scope.relTypes[k]);
                }
            }
        });



        $scope.sensesToAdd = {};
        $scope.sensesToRem = {};

        var synsetId = 0;
        if($stateParams.id) {
            synsetId = $stateParams.id;
        }

        var defId = 0;
        if($stateParams.defId !== null) {
            defId = $stateParams.defId;
        }

        var relId = 0;
        if($stateParams.relId !== null) {
            relId = $stateParams.relId;
        }

        $scope.selectedDefinition = null;

        $scope.selectedRel = null;

        $scope.relTree = [];

        /*var arr = [
            {'id':21 ,'name' : 'name 1' ,'vehiclename' : 'vehicle 1' ,'parentid' : 21},
            {'id':21 ,'name' : 'name 2' ,'vehiclename' : 'vehicle 2' ,'parentid' : 21},
            {'id':22 ,'name' : 'name 3' ,'vehiclename' : 'vehicle 1' ,'parentid' : 22},
            {'id':22 ,'name' : 'name 4' ,'vehiclename' : 'vehicle 2' ,'parentid' : 22}
        ];

        var testGroup = _.groupBy(arr, 'id');
        arr[0].name = 'xxx';
        console.log(_.groupBy(arr, 'id'));*/

        /*grouped = _.map(_.groupBy(arr, 'id'), function(b) {
            return _.extend(_.pick(b[0], 'id', 'name'), {
                vehicles: _.map(b, function(elem) {
                    return _.pick(elem, 'vehiclename', 'parentid')
                })
            });
        });*/

        if(synsetId) {
            var synSet = wnwbApi.SynSet.get({id: synsetId}, function () {
                $scope.synSet = synSet;
                AnchorService.pushSynSet(synSet);
                //WorkingLexiconService.setWorkingLexiconId(synSet.lexicon);
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

        $scope.$watchCollection('synSet.relations', function (newValue, oldValue) {
            if(newValue) {

                $scope.relTree = [
                    {name: 'Directional (outgoing)', nodes: []},
                    {name: 'Directional (incoming)', nodes: []},
                    {name: 'Bidirectional', nodes: []},
                    {name: 'Non-directional', nodes: []}
                ];
                var relationsGrouped = _.groupBy($scope.synSet.relations, 'rel_type');
                console.log($scope.relTypeMap);
                for(k in relationsGrouped) {
                    var relType = $scope.relTypeMap[k];
                    var nodes = [];
                    for(k2 in relationsGrouped[k]) {
                        nodes.push({
                            rel: relationsGrouped[k][k2],
                            name: relationsGrouped[k][k2].targetlabel,
                            nodes: []
                        });
                    }
                    if(relType.direction == 'd') {
                        $scope.relTree[0].nodes.push({
                            name: relType.name,
                            nodes: nodes
                        });
                    }
                    if(relType.direction == 'b') {
                        $scope.relTree[2].nodes.push({
                            name: relType.name,
                            nodes: nodes
                        });
                    }
                    if(relType.direction == 'n') {
                        $scope.relTree[3].nodes.push({
                            name: relType.name,
                            nodes: nodes
                        });
                    }
                }
            }
        });

        /*
        Definition methods
         */
        $scope.selectedDefinition = null;
        $scope.tempDef = {};
        $scope.selectDefinition = function (def) {
            $scope.selectedDefinition = def;
            if($scope.selectedDefinition) {
                $state.go('synset.def', {id: $scope.synSet.id, defId: $scope.selectedDefinition.id}).then(function () {
                    //console.log('broadcast def loaded 1');
                    //$scope.$broadcast('definition-loaded', $scope.selectedDefinition);
                });
            }
        };

        $scope.requestDefinition = function (defId, callback) {
            if(defId) {
                var unregister = $scope.$watch('synSet', function(newValue, oldValue) {
                    if(newValue) {
                        //console.log(newValue);
                        for (k in $scope.synSet.synset_definitions) {
                            if ($scope.synSet.synset_definitions[k].id == defId) {
                                $scope.selectedDefinition = $scope.synSet.synset_definitions[k];
                                break;
                            }
                        }
                        callback($scope.selectedDefinition);
                        unregister();
                    }
                });
            }
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



        /*
        Sense variants methods
         */
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
                    $scope.synSet.senses.push({id: sense.id, label: sense.label});
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

        /*
        Relation methods
         */
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

        /*
        Synset methods
         */
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
    }]);
});