/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/senseRelType/addCtrl',
    'controller/admin/senseRelType/editCtrl',
    'controller/main/confirmDeleteCtrl',
    'service/SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('admin/SenseRelTypeCtrl', ['$scope', '$state', '$log', '$uibModal', 'wnwbApi', 'service/SenseRelTypeService', function ($scope, $state, $log, $uibModal, wnwbApi, relTypeService) {

        console.log('admin/SenseRelTypeCtrl');

        $scope.relTypes = null;

        $scope.loadData = function () {
            relTypeService.load();
            relTypeService.getList().then(function (result) {
                $scope.relTypes = result;
            });
        };

        $scope.openCreateModal = function () {
            $scope.senseRelType = new wnwbApi.SenseRelType();

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/addCtrl'
            }).result.then(function (synSetRelType) {
                    $scope.loadData();
                },
                function (result) {
                    $scope.loadData();
                });
        };

        $scope.openEditModal = function (senseRelType) {
            $scope.senseRelType = senseRelType;

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/editCtrl'
            }).result.then(function (synSetRelType) {
                    $scope.loadData();
                },
                function (result) {
                    $scope.loadData();
                });
        };

        $scope.openDeleteModal = function (senseRelType) {
            return $uibModal.open({
                templateUrl: 'view/main/confirmDeleteModal.html',
                scope: $scope,
                controller: 'main/ConfirmDeleteCtrl',
                resolve: {
                    entity: function(){
                        return 'SenseRelType';
                    }
                }
            })
                .result.then(function (result) {
                    if(result) {
                        wnwbApi.SenseRelType.delete({id: senseRelType.id}, function () {
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