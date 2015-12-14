/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/synSetRelType/editCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $modalInstance, wnwbApi) {

        console.log('edit ctrl');

        $scope.setupOtherOptions = function () {
            $scope.otherOptions = [{id: 0, name: 'N/A'}];
            for(k in $scope.synSetRelTypes) {
                if($scope.synSetRelTypes[k].direction == $scope.synSetRelType.direction) {
                    $scope.otherOptions.push($scope.synSetRelTypes[k]);
                }
            }
        };

        $scope.$watch('senseRelType.direction', function (newVal, oldVal) {
            $scope.setupOtherOptions();
        });

        $scope.setupOtherOptions();

        $scope.save = function (form) {
            console.log('[admin/synSetRelType/editCtrl] save '+$scope.synSetRelType.id);

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.synSetRelType.$update({id: $scope.synSetRelType.id}, function () {
                $modalInstance.close($scope.synSetRelType);
                $scope.loadData();
            });
        };
    }]);
});