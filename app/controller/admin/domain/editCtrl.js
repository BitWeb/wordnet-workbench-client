/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/domain/editCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $modalInstance, wnwbApi) {

        console.log('edit ctrl');

        $scope.save = function (form) {
            console.log('[admin/domain/editCtrl] save '+$scope.domain.id);

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.domain.$update({id: $scope.domain.id}, function () {
                $modalInstance.close($scope.senseRelType);
                $scope.loadData();
            });
        };
    }]);
});