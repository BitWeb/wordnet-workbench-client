define(['appModule', 'AuthService', 'angular-storage', 'underscore', 'controller/main/selectLexiconCtrl', 'controller/main/literalSearchCtrl'], function (app) {

    app.controller('MainCtrl',
        ['$scope', '$state', 'AuthService','config','$rootScope', 'wnwbApi', '$localStorage', '$sessionStorage', '$uibModal',
            function ($scope, $state, authService, config, $rootScope, wnwbApi, $localStorage, $sessionStorage, $uibModal) {

                console.log('MainController');

                $scope.$storage.anchor = [
                    {name: 'n:baas-1'},
                    {name: 'n:baas-2'}
                ];

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
                        }
                    });
                };



                /*$rootScope.addError = function (rejection) {

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
                };*/

            }]);
});
