/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/ConfirmDeleteCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', function ($scope, $state, $uibModal, $uibModalInstance) {

        $scope.confirm = function () {
            $uibModalInstance.close(true);
        };

        $scope.cancel = function () {
            $uibModalInstance.close(false);
        };

    }]);
});