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

            $log.log('controller/sense/RelCtrl');

            var relId = null;
            if($stateParams.relId !== null) {
                relId = $stateParams.relId;
            }

            $scope.relationList = null;
            $scope.tempRel = {};

            //Counter options
            $scope.fParentCounterRelType = false;
            $scope.counterRelTypes = [];

            $scope.relation = {
                selectedRelType: {},
                counterRelType: {},
                targetSense: null
            };

            $scope.getRelationList().then(function (relationList) {
                $log.log('RelCtrl get relation list');
                $scope.relationList = relationList;
            });

            $scope.getRelation(relId).then(function (rel) {
                $scope.tempRel = angular.copy(rel);
                if($scope.tempRel) {
                    $scope.relation.selectedRelType = relTypeService.getById($scope.tempRel.rel_type);
                    if($scope.relation.selectedRelType.direction == 'd') {
                        $scope.relation.targetSense = wnwbApi.Sense.get({id: $scope.tempRel.b_sense});
                    }
                    if($scope.relation.selectedRelType.direction == 'b' || $scope.relation.selectedRelType.direction == 'n') {
                        if($scope.tempRel.a_sense == $scope.currentSense.id) {
                            $scope.relation.targetSense = wnwbApi.Sense.get({id: $scope.tempRel.b_sense});
                        }
                        if($scope.tempRel.b_sense == $scope.currentSense.id) {
                            $scope.relation.targetSense = wnwbApi.Sense.get({id: $scope.tempRel.a_sense});
                        }
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


            $scope.addRel = function (sourceId, targetId, relTypeId) {
                $scope.relationList.push({
                    a_sense: sourceId,
                    b_sense: targetId,
                    rel_type: relTypeId
                });
            };

            $scope.removeRel = function (relationId) {
                if(relationId) {
                    var aTypeId = null;

                    for(var i = 0;i < $scope.relationList.length;i++) {
                        if($scope.relationList[i].id == relationId) {
                            $log.log('removing rel');
                            aTypeId = $scope.relationList[i].rel_type;
                            $scope.relationList.splice(i, 1);
                            break;
                        }
                    }
                    if(aTypeId) {
                        aType = relTypeService.getById(aTypeId);
                        bTypes = relTypeService.getCounterRelTypes(aType.id);
                        $log.log(aType);
                        $log.log(bTypes);
                        for(k in bTypes) {
                            var bTypeId = bTypes[k].id;
                            for(var i = 0;i < $scope.relationList.length;i++) {
                                if($scope.relationList[i].rel_type == bTypeId) {
                                    $log.log('removing counter');
                                    $scope.relationList.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
            };

            // Possible errors
            // Relation (type+a+b) alrady exists
            // Target null
            // Required counter missing (somehow)
            $scope.saveRel = function () {
                var rel = $scope.tempRel;
                var relType = $scope.relation.selectedRelType;
                var counterRelType = $scope.relation.counterRelType;
                var targetSense = $scope.relation.targetSense;

                if(targetSense) {

                    if(rel) {
                        $scope.removeRel(rel.id);
                    }

                    // error if rel already exists
                    if(relType) {
                        $scope.addRel($scope.currentSense.id, targetSense.id, relType.id);
                    }

                    if(counterRelType && counterRelType.id) {
                        $scope.addRel(targetSense.id, $scope.currentSense.id, counterRelType.id);
                    }

                }

                $scope.$parent.saveRel(rel, relType, counterRelType, targetSense);
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
                        var targetSense = wnwbApi.Sense.get({id: sense.id}, function () {
                            $scope.relation.targetSense = targetSense;
                        });
                    },
                    function (result) {

                    });
            };
        }
    ]);
});