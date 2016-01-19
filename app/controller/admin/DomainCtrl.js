/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/domain/addCtrl',
    'controller/admin/domain/editCtrl',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('admin/DomainCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', 'service/LexiconService', function ($scope, $state, $uibModal, wnwbApi, lexiconService) {

        $scope.workingLexicon = lexiconService.getWorkingLexicon();

        $scope.lexicons = lexiconService.getLexicons();

        $scope.loadDomains = function () {
            if($scope.workingLexicon) {
                var domains = wnwbApi.Domain.query({lexid: $scope.workingLexicon.id}, function () {
                    $scope.domains = domains;
                });
            } else {
                console.log('[admin/DomainCtrl] $scope.workingLexicon is null');
            }
        };

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
            wnwbApi.Domain.delete({id: domain.id}, function () {
                $scope.loadDomains();
            });
        };

        $scope.$on('workingLexiconChangedByUser', function (event) {
            $scope.workingLexicon = lexiconService.getWorkingLexicon();
            $scope.loadDomains();
        });

        $scope.loadDomains();
    }]);
});