/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/synSetRelType/editCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $uibModalInstance, wnwbApi) {

        $scope.synSetRelType = angular.copy($scope.$parent.synSetRelType);

        $scope.initCounterpartOptions = function () {
            $scope.counterpartOptions = [{id: 0, name: 'N/A'}];
            angular.forEach($scope.synSetRelTypes, function(value, key) {
                if(value != $scope.synSetRelType && (value.direction == $scope.synSetRelType.direction || $scope.synSetRelType.other == value.id)) {
                    $scope.counterpartOptions.push(value);
                }
            });
        };

        $scope.$watch('synSetRelType.direction', function (newVal, oldVal) {
            if(oldVal != newVal) {
                $scope.synSetRelType.other = 0;
            }

            $scope.initCounterpartOptions();
        });

        $scope.initCounterpartOptions();

        $scope.save = function (form) {
            console.log('[admin/synSetRelType/editCtrl] save '+$scope.synSetRelType.id);

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.synSetRelType.$update({id: $scope.synSetRelType.id}, function () {
                $uibModalInstance.close($scope.synSetRelType);
            });
        };
    }]);
});