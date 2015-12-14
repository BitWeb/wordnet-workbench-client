/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/synSetRelType/addCtrl',
    'controller/admin/synSetRelType/editCtrl'
], function (angularAMD) {

    angularAMD.controller('SynSetRelTypeCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', function ($scope, $state, $uibModal, wnwbApi) {
        console.log('SynSetRelTypeCtrl');

        $scope.loadData = function () {
            var synSetRelTypes = wnwbApi.SynSetRelType.query(function () {
                $scope.synSetRelTypes = synSetRelTypes;
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

        $scope.deleteSenseRelType = function (synSetRelType) {
            wnwbApi.SynSetRelType.delete({id: synSetRelType.id}, function () {
                $scope.loadData();
            });
        };

        $scope.loadData();
    }]);
});