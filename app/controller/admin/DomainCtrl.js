/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/domain/addCtrl',
    'controller/admin/domain/editCtrl'
], function (angularAMD) {

    angularAMD.controller('DomainCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', function ($scope, $state, $uibModal, wnwbApi) {
        console.log('DomainCtrl');

        var domains = wnwbApi.Domain.query({lexid: $scope.$storage.currentLexicon.id}, function () {
            $scope.domains = domains;
        });

        var lexicons = wnwbApi.Lexicon.query(function () {
            $scope.lexicons = lexicons;
        });

        console.log('Domains: ');
        console.log($scope.domains);

        $scope.openCreateModal = function () {

        };

        $scope.openAddModal = function () {
            $scope.domain = new wnwbApi.Domain();
            return $uibModal.open({
                templateUrl: 'view/admin/addEditDomain.html',
                scope: $scope,
                controller: 'admin/domain/addCtrl'
            });
        };

        $scope.openEditModal = function (domain) {
            console.log('Edit domain: '+domain);
            console.debug(domain);
            $scope.domain = domain;
            return $uibModal.open({
                templateUrl: 'view/admin/addEditDomain.html',
                scope: $scope,
                controller: 'admin/domain/editCtrl'
            });
        };

        $scope.deleteDomain = function (domain) {
            wnwbApi.Domain.delete({id: domain.id});
        };
    }]);
});