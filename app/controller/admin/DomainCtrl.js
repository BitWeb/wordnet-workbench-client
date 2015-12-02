/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('DomainCtrl', ['$scope','$state', 'SenseRelTypeService', function ($scope, $state, senseRelTypeService) {
        console.log('DomainCtrl');

        senseRelTypeService.getList({}, function (data) {
            $scope.senseRelTypes = data;
        });

        $scope.openCreateModal = function () {

        };
    }]);
});