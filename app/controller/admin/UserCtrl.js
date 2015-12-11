/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('UserCtrl', ['$scope','$state', function ($scope, $state) {
        console.log('UserCtrl');

        $scope.openCreateModal = function () {

        };
    }]);
});