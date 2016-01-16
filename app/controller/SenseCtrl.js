/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate',
    'service/LexiconService',
    'service/SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('SenseCtrl', ['$scope', '$state', '$stateParams', '$q', '$log', '$uibModal', 'wnwbApi', '$animate', 'service/LexiconService', 'service/SenseRelTypeService', function ($scope, $state, $stateParams, $q, $log, $uibModal, wnwbApi, $animate, lexiconService, relTypeService) {

        var sensePromise = null;

        var senseId = 0;
        if($stateParams.senseId) {
            senseId = $stateParams.senseId;
        }

        $scope.sense = {};

        //TODO: use DomainService instead
        var domains = wnwbApi.Domain.query(function () {
            $scope.domains = domains;
        });

        $scope.selectedDefinition = null;
        $scope.tempDef = {};
        $scope.selectDefinition = function (def) {
            $scope.selectedDefinition = def;
            if($scope.selectedDefinition) {
                //var index = $scope.sense.sense_definitions.indexOf($scope.selectedDefinition);
                $state.go('.def', {id: $scope.sense.id, defId: $scope.selectedDefinition.id}).then(function () {
                    $scope.$broadcast('sense-loaded', $scope.sense);
                });
            }
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
                            name: relationsGrouped[k][k2].targetlabel,
                            nodes: []
                        };
                        if(relationsGrouped[k][k2].a_sense == $scope.sense.id) {
                            nodes_out.push(obj);
                        }
                        if(relationsGrouped[k][k2].b_sense == $scope.sense.id) {
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
                            $scope.selectedRelation = synSet.relations[k];
                            deferred.resolve(synSet.relations[k]);
                            fFound = true;
                            break;
                        }
                    }
                    if (!fFound) {
                        deferred.reject('not found');
                    }
                });
            } else {
                deferred.resolve(null);
            }

            return deferred.promise;
        };

        $scope.addRel = function () {
            $state.go('.rel', {relId: null});
        };

        $scope.selectRel = function (relation) {
            $state.go('.rel', {relId: relation.id});
        };

        $scope.discardRel = function () {
            $state.go('^');
        };

        $scope.saveRel = function (rel, counterRel, targetSynSet) {
            if(rel.type) {
                var synSetRel = {
                    a_sense: $scope.sense.id,
                    b_sense: targetSynSet.id,
                    rel_type: rel.type.id,
                    targetlabel: targetSynSet.label
                };
                $scope.sense.relations.push(synSetRel);
            }
            if(counterRel.type) {
                var synSetRel = {
                    a_sense: targetSynSet.id,
                    b_sense: $scope.sense.id,
                    rel_type: counterRel.type.id,
                    targetlabel: targetSynSet.label
                };
                $scope.sense.relations.push(synSetRel);
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
            angular.copy($scope.tempExtRef, $scope.selectedExtRef);
            $scope.cancelExtRef();
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
            if($scope.sense.id) {
                $scope.sense.$update({id: $scope.sense.id}, function () {
                    wnwbApi.Sense.get({id: senseId}, function (result) {
                        $scope.sense = result;
                        if($scope.currentSynSet !== undefined) {
                            $scope.$parent.saveSense($scope.sense);
                            $state.go('^', {senseId: $scope.sense.id});
                        } else {
                            $state.go('.', {id: $scope.sense.id});
                        }
                    });
                });
            } else {
                $scope.sense.lexical_entry.lexicon = lexiconService.getWorkingLexicon().id;
                $scope.sense.$save(function (result) {
                    $scope.sense = result;
                    if($scope.currentSynSet !== null) {
                        $scope.$parent.saveSense($scope.sense);
                        $state.go('^', {senseId: $scope.sense.id});
                    } else {
                        $state.go('.', {id: $scope.sense.id});
                    }
                });
            }
        };

        $scope.discardSenseChanges = function () {

        };



        ////////
        // Init
        ////////

        $scope.init = function () {
            if(senseId) {
                $log.log('set sense promise');
                sensePromise = wnwbApi.Sense.get({id: senseId}).$promise;
                $log.log(sensePromise);

                sensePromise.then(function (sense) {
                    lexiconService.setWorkingLexiconId(sense.lexicon);
                    $scope.sense = sense;
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