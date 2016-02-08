/**
 * Created by Ivar on 21.01.2016.
 */

define([
    'angularAMD',
    'service/SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('sense/RelCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$log',
        '$uibModal',
        'wnwbApi',
        'service/SenseRelTypeService',
        function (
            $scope,
            $state,
            $stateParams,
            $log,
            $uibModal,
            wnwbApi,
            relTypeService,
            relTypes
        ) {

            var relId = null;
            if($stateParams.relId !== null) {
                relId = $stateParams.relId;
            }

            var relTypeId = null;
            if($stateParams.relTypeId !== null) {
                relTypeId = $stateParams.relTypeId;
            }

            var relDir = null;
            if($stateParams.relDir !== null) {
                relDir = $stateParams.relDir;
            }
            if(!relDir) relDir = 'ab';

            $scope.relationList = null;
            $scope.tempRel = {};

            //Counter options
            $scope.fParentCounterRelType = false;
            $scope.counterRelTypes = [];

            $scope.relation = {
                selectedRelType: {},
                counterRelType: {},
                sourceSense: null,
                targetSense: null,
                direction: 'ab'
            };

            $scope.getRelationList().then(function (relationList) {
                $scope.relationList = relationList;
                if(relTypeId)  {
                    $scope.relation.selectedRelType = relTypeService.getById(relTypeId);
                    $scope.relation.direction = relDir;
                }
            });

            //TODO: update parent selected rel - ???
            $scope.getRelation(relId).then(function (rel) {
                $scope.tempRel = angular.copy(rel);
                $scope.sourceSense = $scope.currentSense;
                if($scope.tempRel) {
                    $scope.relation.selectedRelType = relTypeService.getById($scope.tempRel.rel_type);
                    if($scope.tempRel.a_sense == $scope.currentSense.id) {
                        $scope.relation.direction = 'ab';
                        $scope.relation.targetSense = wnwbApi.Sense.get({id: $scope.tempRel.b_sense});
                    }
                    if($scope.tempRel.b_sense == $scope.currentSense.id) {
                        $scope.relation.direction = 'ba';
                        $scope.relation.targetSense = wnwbApi.Sense.get({id: $scope.tempRel.a_sense});
                    }
                } else {
                    $scope.tempRel = {};
                }
            });

            $scope.$watch('relation.selectedRelType', function (newValue, oldValue) {
                if($scope.relation.selectedRelType) {
                    if ($scope.relation.selectedRelType.other) {
                        $scope.fParentCounterRelType = true;
                        $scope.counterRelTypes = [relTypeService.getById($scope.relation.selectedRelType.other)];
                        $scope.relation.counterRelType = relTypeService.getById($scope.relation.selectedRelType.other);

                        $log.log('watch');
                        $log.log($scope.relation.selectedRelType.id);
                        $log.log(relTypeService.getCounterRelTypes($scope.relation.selectedRelType.id));
                    } else {
                        $scope.fParentCounterRelType = false;
                        $scope.counterRelTypes = relTypeService.getCounterRelTypes($scope.relation.selectedRelType.id);
                    }
                }
            });

            $scope.discardRel = function () {
                $scope.$parent.discardRel();
            };

            // Validates A & B IDs
            $scope.validateRel = function (rel) {
                var fIsValid = true;

                $scope.relErrors = {};

                if(!$scope.relation.targetSense) {
                    $scope.relErrors.targetSense = {required: true};
                    fIsValid = false;
                }
                if($scope.relation.targetSense && $scope.relation.targetSense.id == $scope.sourceSense.id) {
                    $scope.relErrors.targetSense = {invalidSelf: true};
                    fIsValid = false;
                }

                return fIsValid;
            };

            $scope.saveRel = function () {
                var rel = $scope.tempRel;
                var relType = $scope.relation.selectedRelType;
                var counterRelType = $scope.relation.counterRelType;
                var targetSense = $scope.relation.targetSense;

                if($scope.validateRel(rel)) {

                    if(targetSense) {

                        if(rel) {
                            $scope.clearRel(rel.id);
                        }

                        if(relType) {
                            if($scope.relation.direction == 'ab') {
                                $scope.setRel({id: $scope.currentSense.id, label: $scope.currentSense.label}, {id: targetSense.id, label: targetSense.label}, relType.id);
                            } else if ($scope.relation.direction == 'ba') {
                                $scope.setRel({id: targetSense.id, label: targetSense.label}, {id: $scope.currentSense.id, label: $scope.currentSense.label}, relType.id);
                            }
                        }

                        if(counterRelType && counterRelType.id) {
                            if($scope.relation.direction == 'ab') {
                                $log.log('setting counter rel '+counterRelType.id);
                                $scope.setRel({id: targetSense.id, label: targetSense.label}, {id: $scope.currentSense.id, label: $scope.currentSense.label}, counterRelType.id);
                            } else if ($scope.relation.direction == 'ba') {
                                $scope.setRel({id: $scope.currentSense.id, label: $scope.currentSense.label}, {id: targetSense.id, label: targetSense.label}, counterRelType.id);
                            }
                        }

                    }

                    $scope.$parent.saveRel(rel, relType, counterRelType, targetSense);
                }
            };

            $scope.selectTarget = function () {
                return $uibModal.open({
                    templateUrl: 'view/main/literalSerachModal.html',
                    scope: $scope,
                    controller: 'main/literalSearchCtrl',
                    resolve: {
                        searchType: function () {return 'sense';},
                        lexiconMode: function () {return null;}
                    }
                }).result.then(function (sense) {
                        if(sense) {
                            var targetSynset = wnwbApi.Sense.get({id: sense.id}, function () {
                                $scope.relation.targetSense = targetSynset;
                            });
                        }
                    },
                    function (result) {

                    });
            };
        }
    ]);
});