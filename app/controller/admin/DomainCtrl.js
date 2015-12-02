/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'SenseRelTypeService'
], function (angularAMD) {

    angularAMD.controller('DomainCtrl', ['$scope','$state', 'SenseRelTypeService', 'wnwbApi', function ($scope, $state, senseRelTypeService, wnwbApi) {
        console.log('DomainCtrl');

        $scope.domains = wnwbApi.Domain.query();
        console.log($scope.domains);

        $scope.openCreateModal = function () {

        };
    }]);
});