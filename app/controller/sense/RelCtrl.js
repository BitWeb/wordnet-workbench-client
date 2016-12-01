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
        '$q',
        '$uibModal',
        'wnwbApi',
        'service/DirtyStateService',
        'service/ConfirmModalService',
        'service/SenseRelTypeService',
        function (
            $scope,
            $state,
            $stateParams,
            $log,
            $q,
            $uibModal,
            wnwbApi,
            dirtyStateService,
            confirmModalService,
            relTypeService,
            relTypes
        ) {
        	$log.log('controller/sense/RelCtrl');
        	$scope.baseState = $scope.state;

            // Save propagation
            $scope.childMethodsObj = null;
            if($scope.childMethods) {
                $scope.childMethodsObj = $scope.childMethods;
                var saveFunc = function () {
                    return $scope.saveRelPromise();
                };
                $scope.childMethodsObj.propagatedSave = saveFunc;
            }
            $scope.childMethods = {propagatedSave: null};

            $scope.$on('$destroy', function (event) {
                if($scope.childMethodsObj) {
                    $scope.childMethodsObj.propagatedSave = null;
                }
            });

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
            $scope.originalRel = null;

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
                $scope.relation.sourceSense = $scope.currentSense;
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
                            var targetSense = wnwbApi.Sense.get({id: sense.id}, function () {
                                $scope.relation.targetSense = targetSense;
                            });
                        }
                    },
                    function (result) {

                    });
            };

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
                if($scope.relation.targetSense && $scope.relation.targetSense.id == $scope.relation.sourceSense.id) {
                    $scope.relErrors.targetSense = {invalidSelf: true};
                    fIsValid = false;
                }

                return fIsValid;
            };

            $scope.saveRel = function () {
                var d = $q.defer();
                var p = d.promise;

                var rel = $scope.tempRel;
                var relType = $scope.relation.selectedRelType;
                var counterRelType = $scope.relation.counterRelType;
                var targetSense = $scope.relation.targetSense;

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

                $scope.originalRel = angular.copy($scope.tempRel);

                $scope.$parent.saveRel(rel, relType, counterRelType, targetSense);

                d.resolve(true);
                return p;
            };

            $scope.saveRelPromise = function () {
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

                    if(!$scope.validateRel($scope.tempRel) || !fChildrenSaved) {
                        fValid = false;
                    }

                    if(fChildrenSaved && fValid) {
                        $scope.saveRel().then(function () {
                            d.resolve(true);
                        });
                    } else {
                        d.resolve(false);
                    }
                });

                return p;
            };

            $scope.saveRelAction = function () {
                $scope.saveRelPromise().then(function (fSaved) {
                    if(fSaved) {
                        $state.go('synset_edit.sense_edit');
                    }
                });
            };

            $scope.closeRelAction = function () {
                $state.go('synset.sense');
            };
        }
    ]);
});