/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/synSetRelType/addCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', function ($scope, $state, $uibModal, $modalInstance) {
        console.log('admin/synSetRelType/addCtrl');

        $scope.save = function (form) {
            form.submitted = true;
            if(!form.$valid){
                return;
            }

            form.submitted = true;
            if(!form.$valid){
                return;
            }

            $scope.synSetRelType.$save(function() {
                $modalInstance.close($scope.synSetRelType);
                $scope.loadData();
            });
        };
    }]);
});