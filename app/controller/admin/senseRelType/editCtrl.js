/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/senseRelType/editCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $uibModalInstance, wnwbApi) {

        $scope.senseRelType = angular.copy($scope.$parent.senseRelType);

        $scope.initCounterpartOptions = function () {
            $scope.counterpartOptions = [{id: 0, name: 'N/A'}];
            angular.forEach($scope.relTypes, function(value, key) {
                if(value != $scope.senseRelType && (value.direction == $scope.senseRelType.direction || $scope.senseRelType.other == value.id)) {
                    $scope.counterpartOptions.push(value);
                }
            });
        };

        $scope.$watch('senseRelType.direction', function (newVal, oldVal) {
            if(oldVal != newVal) {
                $scope.senseRelType.other = 0;
            }

            $scope.initCounterpartOptions();
        });

        $scope.initCounterpartOptions();

        $scope.save = function (form) {
            console.log('[admin/senseRelType/editCtrl] save '+$scope.senseRelType.id);

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.senseRelType.$update({id: $scope.senseRelType.id}, function () {
                $uibModalInstance.close($scope.senseRelType);
            });
        };
    }]);
});