/**
 * Created by ivar on 17.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/synset/RelCtrl', ['$scope','$state', '$stateParams', '$uibModal', 'wnwbApi', function ($scope, $state, $stateParams, $uibModal, wnwbApi) {
        console.log('controller/synset/RelCtrl');

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

        $scope.fParentCounterRelType = false;
        $scope.counterRelTypes = [];

        $scope.rel = {};
        $scope.counterRel = {};

        $scope.targetSynSet = null;

        $scope.$watch('rel.type', function (newValue, oldValue) {
            if($scope.rel.type) {
                if ($scope.rel.type.other) {
                    $scope.fParentCounterRelType = true;
                    $scope.counterRelTypes = [$scope.relTypeMap[$scope.rel.type.other]];
                    $scope.counterRel = $scope.relTypeMap[$scope.rel.type.other];
                } else {
                    $scope.fParentCounterRelType = false;
                    $scope.counterRelTypes = $scope.rel.type.children;
                }
            }
        });

        $scope.discardRel = function () {
            $state.go('^');
        };

        $scope.saveRel = function () {
            if($scope.rel.type) {
                var rel = {
                    a_synset: $scope.synSet.id,
                    b_synset: $scope.targetSynSet.id,
                    rel_type: $scope.rel.type.id
                };
                $scope.synSet.relations.push(rel);
            }
            if($scope.counterRel.type) {
                var rel = {
                    a_synset: $scope.targetSynSet.id,
                    b_synset: $scope.synSet.id,
                    rel_type: $scope.counterRel.type.id
                };
                $scope.synSet.relations.push(rel);
            }
            $state.go('^');
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

    }]);
});