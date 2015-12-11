/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('SynSetRelTypeCtrl', ['$scope','$state', 'wnwbApi', function ($scope, $state, wnwbApi) {
        console.log('SynSetRelTypeCtrl');

        $scope.synSetRelTypes = wnwbApi.SynSetRelType.query();

        $scope.openCreateModal = function () {

        };
    }]);
});