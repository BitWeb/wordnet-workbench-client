/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('SynSetRelTypeCtrl', ['$scope','$state', 'SenseRelTypeService', 'wnwbApi', function ($scope, $state, senseRelTypeService, wnwbApi) {
        console.log('SynSetRelTypeCtrl');

        $scope.synSetRelTypes = wnwbApi.SynSetRelType.query();

        $scope.openCreateModal = function () {

        };
    }]);
});