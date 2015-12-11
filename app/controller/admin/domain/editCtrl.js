/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/domain/editCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $modalInstance, wnwbApi) {

        console.log('edit ctrl');

        $scope.save = function (form) {
            console.log('save');

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.domain.$update();
            //$scope.domain.$save();
            /*senseRelTypeService.createSenseRelType( $scope.senseRelType, function (err, senseRelType) {
                if(err){
                    console.log(err);
                    return alert('Err');
                }

                $modalInstance.close(senseRelType);
            });*/
        };
    }]);
});