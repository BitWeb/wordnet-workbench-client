/**
 * Created by ivar on 17.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/synset/RelCtrl', ['$scope','$state', '$stateParams', '$uibModal', 'wnwbApi', function ($scope, $state, $stateParams, $uibModal, wnwbApi) {
        console.log('controller/synset/RelCtrl');

        var relId = null;
        if($stateParams.relId !== null) {
            relId = $stateParams.relId;
        }

        $scope.rel = {};

        /*$scope.tempRelTypeMap = {};

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
        });*/

        $scope.fParentCounterRelType = false;
        $scope.counterRelTypes = [];

        $scope.tempRel = {};
        $scope.counterRel = {};

        $scope.targetSynSet = null;

        $scope.$watch('rel.type', function (newValue, oldValue) {
            if($scope.tempRel.type) {
                if ($scope.tempRel.type.other) {
                    $scope.fParentCounterRelType = true;
                    $scope.counterRelTypes = [$scope.tempRelTypeMap[$scope.tempRel.type.other]];
                    $scope.counterRel = $scope.tempRelTypeMap[$scope.tempRel.type.other];
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
            $scope.$parent.saveRel($scope.tempRel, $scope.counterRel);
        };

        $scope.selectTarget = function () {
            return $uibModal.open({
                templateUrl: 'view/main/literalSerachModal.html',
                scope: $scope,
                controller: 'main/literalSearchCtrl'
            });
        };

        $scope.testSenseSelect = function (sense) {
            if(sense.synset) {
                var targetSynset = wnwbApi.SynSet.get({id: sense.synset}, function () {
                    $scope.targetSynSet = targetSynset;
                });
                console.log('selected synset id: '+sense.synset);
            }
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            console.log('RelCtrl::$stateChangeSuccess');
            $scope.requestRel(relId, function (rel) {
                $scope.tempRel = angular.copy(rel);
            });
        });

    }]);
});