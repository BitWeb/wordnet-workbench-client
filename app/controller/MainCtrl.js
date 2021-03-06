define([
        'appModule',
        'AuthService',
        'angular-storage',
        'underscore',
        'controller/main/selectLexiconCtrl',
        'controller/main/literalSearchCtrl',
        'controller/main/ExtendedSearchCtrl',
        'service/LexiconService'
    ],
    function (app) {

        app.controller('MainCtrl', [
            '$scope',
            '$state',
            'AuthService',
            'config',
            '$rootScope',
            'wnwbApi',
            '$localStorage',
            '$sessionStorage',
            '$uibModal',
            '$timeout',
            'service/LexiconService',
            function ($scope, $state, authService, config, $rootScope, wnwbApi, $localStorage, $sessionStorage, $uibModal, $timeout, lexiconService) {
                $scope.openLiteralSearch = function () {
                    return $uibModal.open({
                        templateUrl: 'view/main/literalSerachModal.html',
                        scope: $scope,
                        controller: 'main/literalSearchCtrl',
                        resolve: {
                            searchType: function () {
                                return 'synset';
                            }
                            , lexiconMode: function () {return null;}
                            , searchMode : function() {return 'open';}
                        },
                        size: 'lg'
                    });
                };

                
                $scope.openExtendedSearch = function () {
                    return $uibModal.open({
                        templateUrl: 'view/main/extendedSearchModal.html',
                        scope: $scope,
                        controller: 'main/ExtendedSearchCtrl',
                        resolve: {},
                        size: 'lg'
                    });
                };

                /*$rootScope.addError = function (rejection) {

                    if(rejection.status == 401 && !$rootScope.user){
                        return;
                    }
                    $uibModal.open({
                        controller: 'ErrorModalController',
                        templateUrl: '../../views/errorModal.html',
                        resolve: {
                            rejection: function () {
                                return rejection;
                            }
                        }
                    });
                };*/

            }]);
});
