/**
 * Created by ivar on 12.01.16.
 */

define([
    'angularAMD',
    'controller/admin/extRelType/addCtrl',
    'controller/admin/extRelType/editCtrl',
    'controller/main/confirmDeleteCtrl'
], function (angularAMD) {

    angularAMD.controller('admin/ExtRefTypeCtrl', ['$scope', '$state', '$uibModal', 'wnwbApi', function ($scope, $state, $uibModal, wnwbApi) {

        $scope.senseRelTypes = [];
        $scope.senseRelTypeMap = {};

        $scope.loadData = function () {
            var senseRelTypes = wnwbApi.SenseRelType.query(function () {
                $scope.senseRelTypes = [];
                $scope.senseRelTypeMap = {};
                angular.forEach(senseRelTypes, function (value, key) {
                    $scope.senseRelTypes.push(value);
                    $scope.senseRelTypeMap[value.id] = value;
                });
            });
        };

        $scope.openCreateModal = function () {
            $scope.senseRelType = new wnwbApi.SenseRelType();

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/addCtrl'
            });
        };

        $scope.openEditModal = function (senseRelType) {
            $scope.senseRelType = senseRelType;

            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/editCtrl'
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