define([
        'appModule',
        'AuthService',
        'angular-storage',
        'underscore',
        'controller/main/selectLexiconCtrl',
        'controller/main/literalSearchCtrl',
        'service/LexiconService',
        'service/TestService'
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
            'service/TestService',
            function ($scope, $state, authService, config, $rootScope, wnwbApi, $localStorage, $sessionStorage, $uibModal, $timeout, lexiconService, testService) {

                console.log('MainCtrl');

                testService.init();
                testService.a = 20;
                console.log('test a '+testService.a);

                $scope.openLiteralSearch = function () {
                    console.log('open literal search modal');
                    return $uibModal.open({
                        templateUrl: 'view/main/literalSerachModal.html',
                        scope: $scope,
                        controller: 'main/literalSearchCtrl',
                        resolve: {
                            searchType: function () {
                                return null;
                            }
                        },
                        size: 'lg'
                    });
                };

                $rootScope.addError = function (rejection) {

                    if(rejection.status == 401 && !$rootScope.user){
                        return;
                    }
                    $modal.open({
                        controller: 'ErrorModalController',
                        templateUrl: '../../views/errorModal.html',
                        resolve: {
                            rejection: function () {
                                return rejection;
                            }
                        }
                    });
                };

            }]);
});
