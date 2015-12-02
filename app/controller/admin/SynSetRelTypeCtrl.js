/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('SynSetRelTypeCtrl', ['$scope','$state', 'SenseRelTypeService', function ($scope, $state, senseRelTypeService) {
        console.log('SynSetRelTypeCtrl');

        $scope.synsetRelTypes = wnwbApi.SynSetRelType.query();

        $scope.openCreateModal = function () {

        };
    }]);
});