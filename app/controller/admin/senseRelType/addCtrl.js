/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/senseRelType/addCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', function ($scope, $state, $uibModal, $modalInstance) {
        console.log('admin/senseRelType/SenseRelTypeCtrl');

        $scope.save = function (form) {
            form.submitted = true;
            if(!form.$valid){
                return;
            }

            $scope.senseRelType.$save(function() {
                $modalInstance.close($scope.senseRelType);
                $scope.loadData();
            });
        };
    }]);
});