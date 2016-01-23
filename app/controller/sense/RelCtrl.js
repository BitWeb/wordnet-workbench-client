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
            relTypeService
        ) {

            $log.log('controller/sense/RelCtrl');

            $scope.relTypes = null;

            relTypeService.getList().then(function (relTypes) {
                $scope.relTypes = relTypes;
            });

            var relId = null;
            if($stateParams.relId !== null) {
                relId = $stateParams.relId;
            }

            $scope.getRelation(relId).then(function (rel) {
                $scope.tempRel = angular.copy(rel);
                if(!$scope.tempRel) {
                    $scope.tempRel = {};
                }
            });

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
                        searchType: function () {return 'sense';},
                        lexiconMode: function () {return null;}
                    }
                }).result.then(function (sense) {
                        var relTarget = wnwbApi.Sense.get({id: sense.id}, function () {
                            $scope.targetSynSet = relTarget;
                        });
                    },
                    function (result) {

                    });
            };

        }
    ]);
});