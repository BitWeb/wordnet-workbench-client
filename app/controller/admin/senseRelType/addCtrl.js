/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('admin/senseRelType/addCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', function ($scope, $state, $uibModal, $modalInstance) {
        console.log('admin/senseRelType/SenseRelTypeCtrl');

        $scope.senseRelType = {
            id: null,
            name: '',
            direction: '',
            description: 'test'
        };

        $scope.save = function (form) {
            form.submitted = true;
            if(!form.$valid){
                return;
            }
            senseRelTypeService.createSenseRelType( $scope.senseRelType, function (err, senseRelType) {
                if(err){
                    console.log(err);
                    return alert('Err');
                }

                $modalInstance.close(senseRelType);
            });
        };
    }]);
});