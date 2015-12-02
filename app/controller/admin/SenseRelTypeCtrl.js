/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'SenseRelTypeService',
    'controller/admin/senseRelType/addCtrl',
    'controller/admin/senseRelType/editCtrl'
], function (angularAMD) {

    angularAMD.controller('admin/SenseRelTypeCtrl', ['$scope', '$state', '$uibModal', 'SenseRelTypeService', 'wnwbApi', function ($scope, $state, $uibModal, senseRelTypeService, wnwbApi) {
        console.log('SenseRelTypeCtrl');

        $scope.senseRelTypes = wnwbApi.SenseRelType.query();

        /*senseRelTypeService.getList({}, function (data) {
            $scope.senseRelTypes = data;
        });*/

        $scope.openCreateModal = function () {
            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/addCtrl'
            });
        };

        $scope.openEditModal = function (sense) {
            return $uibModal.open({
                templateUrl: 'view/admin/addEditSenseRelationType.html',
                scope: $scope,
                controller: 'admin/senseRelType/editCtrl'
            });
        };
    }]);
});