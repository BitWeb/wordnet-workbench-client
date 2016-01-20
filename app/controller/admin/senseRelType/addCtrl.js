/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/senseRelType/addCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $uibModalInstance, wnwbApi) {
        console.log('admin/senseRelType/SenseRelTypeCtrl');

        $scope.senseRelType = new wnwbApi.SenseRelType();
        $scope.senseRelType.other = 0;

        $scope.initCounterpartOptions = function () {
            $scope.counterpartOptions = [{id: 0, name: 'N/A'}];
            angular.forEach($scope.senseRelTypes, function(value, key) {
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
            form.submitted = true;
            if(!form.$valid){
                return;
            }

            $scope.senseRelType.$save(function() {
                $uibModalInstance.close($scope.senseRelType);
            });
        };
    }]);
});