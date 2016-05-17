/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/ConfirmModalCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'data', function ($scope, $state, $uibModal, $uibModalInstance, data) {

        $scope.data = angular.copy(data);

        $scope.confirm = function () {
            $uibModalInstance.close(true);
        };

        $scope.cancel = function () {
            $uibModalInstance.close(false);
        };

    }]);
});