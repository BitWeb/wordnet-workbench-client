/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/synSetRelType/addCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', function ($scope, $state, $uibModal, $uibModalInstance) {

        $scope.initCounterpartOptions = function () {
            $scope.counterpartOptions = [{id: 0, name: 'N/A'}];
            angular.forEach($scope.relTypes, function(value, key) {
                if(value != $scope.synSetRelType && (value.direction == $scope.synSetRelType.direction || $scope.synSetRelType.other == value.id)) {
                    $scope.counterpartOptions.push(value);
                }
            });
        };

        $scope.$watch('synSetRelType.direction', function (newVal, oldVal) {
            $scope.initCounterpartOptions();
        });

        $scope.initCounterpartOptions();

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
                $uibModalInstance.close($scope.synSetRelType);
            });
        };
    }]);
});