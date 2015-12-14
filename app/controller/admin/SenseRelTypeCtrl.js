/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/senseRelType/addCtrl',
    'controller/admin/senseRelType/editCtrl'
], function (angularAMD) {

    angularAMD.controller('admin/SenseRelTypeCtrl', ['$scope', '$state', '$uibModal', 'wnwbApi', function ($scope, $state, $uibModal, wnwbApi) {
        console.log('SenseRelTypeCtrl');

        $scope.loadData = function () {
            var senseRelTypes = wnwbApi.SenseRelType.query(function () {
                $scope.senseRelTypes = senseRelTypes;
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

        $scope.deleteSenseRelType = function (senseRelType) {
            wnwbApi.SenseRelType.delete({id: senseRelType.id}, function () {
                $scope.loadData();
            });
        };

        $scope.loadData();
    }]);
});