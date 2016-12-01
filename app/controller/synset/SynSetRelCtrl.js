/**
 * Created by ivar on 17.12.15.
 */

define([
    'angularAMD',
    'service/SynSetRelTypeService'
], function (angularAMD) {

    angularAMD.controller('SynSetRelCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$log',
        '$q',
        '$uibModal',
        'wnwbApi',
        'service/DirtyStateService',
        'service/ConfirmModalService',
        'service/SynSetRelTypeService',
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
        	$log.log('controller/synset/SynSetRelCtrl');
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
                sourceSynSet: null,
                targetSynSet: null,
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
                $scope.relation.sourceSynSet = $scope.currentSynSet;
                if($scope.tempRel) {
                    $scope.relation.selectedRelType = relTypeService.getById($scope.tempRel.rel_type);
                    if($scope.tempRel.a_synset == $scope.currentSynSet.id) {
                        $scope.relation.direction = 'ab';
                        $scope.relation.targetSynSet = wnwbApi.SynSet.get({id: $scope.tempRel.b_synset});
                    }
                    if($scope.tempRel.b_synset == $scope.currentSynSet.id) {
                        $scope.relation.direction = 'ba';
                        $scope.relation.targetSynSet = wnwbApi.SynSet.get({id: $scope.tempRel.a_synset});
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
                        searchType: function () {return 'synset';},
                        lexiconMode: function () {return null;}
                    }
                }).result.then(function (synset) {
                        if(synset) {
                            var targetSynset = wnwbApi.SynSet.get({id: synset.id}, function () {
                                $scope.relation.targetSynSet = targetSynset;
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

                if(!$scope.relation.targetSynSet) {
                    $scope.relErrors.targetSynSet = {required: true};
                    fIsValid = false;
                }
                if($scope.relation.targetSynSet && $scope.relation.targetSynSet.id == $scope.relation.sourceSynSet.id) {
                    $scope.relErrors.targetSynSet = {invalidSelf: true};
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
                var targetSynSet = $scope.relation.targetSynSet;

                if(targetSynSet) {

                    if(rel) {
                        $scope.clearRel(rel.id);
                    }

                    if(relType) {
                        if($scope.relation.direction == 'ab') {
                            $scope.setRel({id: $scope.currentSynSet.id, label: $scope.currentSynSet.label}, {id: targetSynSet.id, label: targetSynSet.label}, relType.id);
                        } else if ($scope.relation.direction == 'ba') {
                            $scope.setRel({id: targetSynSet.id, label: targetSynSet.label}, {id: $scope.currentSynSet.id, label: $scope.currentSynSet.label}, relType.id);
                        }
                    }

                    if(counterRelType && counterRelType.id) {
                        if($scope.relation.direction == 'ab') {
                            $log.log('setting counter rel '+counterRelType.id);
                            $scope.setRel({id: targetSynSet.id, label: targetSynSet.label}, {id: $scope.currentSynSet.id, label: $scope.currentSynSet.label}, counterRelType.id);
                        } else if ($scope.relation.direction == 'ba') {
                            $scope.setRel({id: $scope.currentSynSet.id, label: $scope.currentSynSet.label}, {id: targetSynSet.id, label: targetSynSet.label}, counterRelType.id);
                        }
                    }

                }

                $scope.originalRel = angular.copy($scope.tempRel);

                $scope.$parent.saveRel(rel, relType, counterRelType, targetSynSet);

                d.resolve(true);
                return p;
            };

            $scope.saveRelPromise = function () {
                var d = $q.defer();
                var p = d.promise;

                var childPromise = null;
                if($scope.childMethods.propagatedSave) {
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
                        $state.go('synset_edit');
                    }
                });
            };
        }
    ]);
});