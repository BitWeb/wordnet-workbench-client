/**
 * Created by ivar on 17.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/synset/RelCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$log',
        '$uibModal',
        'wnwbApi',
        function (
            $scope,
            $state,
            $stateParams,
            $log,
            $uibModal,
            wnwbApi)
        {

            $log.log('controller/synset/RelCtrl');

            $scope.getRelation(relId).then(function (rel) {
                $scope.tempRel = angular.copy(rel);
                console.debug($scope.tempRel);
            });

            var relId = null;
            if($stateParams.relId !== null) {
                relId = $stateParams.relId;
            }

            $scope.rel = {};

            $scope.tempRelTypeMap = {};

            var relTypes = wnwbApi.SynSetRelType.query(function (response) {
                $scope.tempRelTypes = [];

                angular.forEach(relTypes, function (value, key) {
                    $scope.tempRelTypes.push(value);
                    value.children = [];
                    $scope.tempRelTypeMap[value.id] = value;
                });

                for(k in $scope.tempRelTypes) {
                    if($scope.tempRelTypeMap[$scope.tempRelTypes[k].other]) {
                        $scope.tempRelTypeMap[$scope.tempRelTypes[k].other].children.push($scope.tempRelTypes[k]);
                    }
                }
            });

            $scope.fParentCounterRelType = false;
            $scope.counterRelTypes = [];

            $scope.tempRel = {};
            $scope.counterRel = {};

            $scope.targetSynSet = null;

            $scope.$watch('tempRel.type', function (newValue, oldValue) {
                if($scope.tempRel.type) {
                    if ($scope.tempRel.type.other) {
                        $scope.fParentCounterRelType = true;
                        $scope.counterRelTypes = [$scope.tempRelTypeMap[$scope.tempRel.type.other]];
                        $scope.counterRel = $scope.tempRelTypeMap[$scope.tempRel.type.other];
                        console.log('Counter rel');
                        console.log($scope.counterRel);
                        console.log($scope.counterRelTypes);
                    } else {
                        $scope.fParentCounterRelType = false;
                        $scope.counterRelTypes = $scope.tempRel.type.children;
                    }
                }
            });

            $scope.discardRel = function () {
                $scope.$parent.discardRel();
            };

            $scope.saveRel = function () {
                $scope.$parent.saveRel($scope.tempRel, $scope.counterRel, $scope.targetSynSet);
            };

            $scope.selectTarget = function () {
                return $uibModal.open({
                    templateUrl: 'view/main/literalSerachModal.html',
                    scope: $scope,
                    controller: 'main/literalSearchCtrl',
                    resolve: {
                        searchType: function () {return 'synset';}
                    }
                }).result.then(function (synset) {
                        var targetSynset = wnwbApi.SynSet.get({id: synset.id}, function () {
                            $scope.targetSynSet = targetSynset;
                        });
                    },
                    function (result) {

                    });
            };

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $log.log('RelCtrl state change success');
            });

        }
    ]);
});