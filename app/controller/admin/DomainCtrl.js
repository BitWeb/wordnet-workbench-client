/**
 * Created by ivar on 30.11.15.
 */

define([
    'angularAMD',
    'controller/admin/domain/addCtrl',
    'controller/admin/domain/editCtrl',
    'service/WorkingLexiconService'
], function (angularAMD) {

    angularAMD.controller('admin/DomainCtrl', ['$scope','$state', '$uibModal', 'wnwbApi', 'service/WorkingLexiconService', function ($scope, $state, $uibModal, wnwbApi, workingLexiconService) {

        $scope.workingLexicon = workingLexiconService.getWorkingLexicon();

        $scope.lexicons = workingLexiconService.getLexicons();

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

        $scope.$on('workingLexiconChanged', function (event) {
            $scope.workingLexicon = workingLexiconService.getWorkingLexicon();
            $scope.loadDomains();
        });

        $scope.loadDomains();
    }]);
});