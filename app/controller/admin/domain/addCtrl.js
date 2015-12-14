/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/domain/addCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', function ($scope, $state, $uibModal, $modalInstance) {
        console.log('add ctrl');

        $scope.save = function (form) {
            console.log('save');

            form.submitted = true;
            if(!form.$valid){
                return;
            }

            console.log($scope.domain);
            $scope.domain.lexicon = 1;
            $scope.domain.$save(function () {
                $modalInstance.close($scope.senseRelType);
                $scope.loadData();
            });
        };
    }]);
});