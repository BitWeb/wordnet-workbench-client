/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/synSetRelType/addCtrl',
    'controller/admin/synSetRelType/editCtrl',
    'service/SynSetRelTypeService'
], function (angularAMD) {

    angularAMD.controller('admin/SynSetRelTypeCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', 'service/SynSetRelTypeService', function ($scope, $state, $uibModal, wnwbApi, relTypeService) {

        $scope.relTypes = null;

        $scope.loadData = function () {
            relTypeService.load();
            relTypeService.getList().then(function (result) {
                $scope.relTypes = result;
            });
        };

        $scope.openCreateModal = function () {
            $scope.synSetRelType = new wnwbApi.SynSetRelType();

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSynSetRelationType.html',
                scope: $scope,
                controller: 'admin/synSetRelType/addCtrl'
            }).result.then(function (synSetRelType) {
                    $scope.loadData();
                },
                function (result) {
                    $scope.loadData();
                });
        };

        $scope.openEditModal = function (synSetRelType) {
            $scope.synSetRelType = synSetRelType;

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSynSetRelationType.html',
                scope: $scope,
                controller: 'admin/synSetRelType/editCtrl'
            }).result.then(function (synSetRelType) {
                    $scope.loadData();
                },
                function (result) {
                    $scope.loadData();
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
                            loadData();
                        });
                    }
                },
                function (result) {

                });
        };

        $scope.loadData();
    }]);
});