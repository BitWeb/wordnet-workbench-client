/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/synSetRelType/addCtrl',
    'controller/admin/synSetRelType/editCtrl'
], function (angularAMD) {

    angularAMD.controller('admin/SynSetRelTypeCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', function ($scope, $state, $uibModal, wnwbApi) {

        $scope.synSetRelTypes = [];
        $scope.senseRelTypeMap = {};

        $scope.loadData = function () {
            var synSetRelTypes = wnwbApi.SynSetRelType.query(function () {
                $scope.synSetRelTypes = [];
                $scope.synSetRelTypeMap = {};
                angular.forEach(synSetRelTypes, function (value, key) {
                    $scope.synSetRelTypes.push(value);
                    $scope.synSetRelTypeMap[value.id] = value;
                });
            });
        };

        $scope.openCreateModal = function () {
            $scope.synSetRelType = new wnwbApi.SynSetRelType();

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSynSetRelationType.html',
                scope: $scope,
                controller: 'admin/synSetRelType/addCtrl'
            });
        };

        $scope.openEditModal = function (synSetRelType) {
            $scope.synSetRelType = synSetRelType;

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSynSetRelationType.html',
                scope: $scope,
                controller: 'admin/synSetRelType/editCtrl'
            });
        };

        $scope.openDeleteModal = function (synSetRelType) {
            return $uibModal.open({
                templateUrl: 'view/main/confirmDeleteModal.html',
                scope: $scope,
                controller: 'main/ConfirmDeleteCtrl',
                resolve: {
                    entity: function(){
                        return 'SynSetRelType';
                    }
                }
            })
                .result.then(function (result) {
                    if(result) {
                        wnwbApi.SynSetRelType.delete({id: synSetRelType.id}, function () {
                            $scope.loadData();
                        });
                    }
                },
                function (result) {

                });
        };

        $scope.loadData();
    }]);
});