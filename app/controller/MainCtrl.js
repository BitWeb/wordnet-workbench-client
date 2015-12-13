/**
 * @ngdoc controller
 * @name Main
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
/*angular.module('myApp').controller('Main', function($scope){

});*/

//myApp

define(['appModule', 'AuthService', 'angular-storage', 'underscore', 'controller/main/selectLexiconCtrl'], function (app) {

    app.controller('MainCtrl',
        ['$scope', '$state', 'AuthService','config','$rootScope', 'wnwbApi', '$localStorage', '$sessionStorage', '$uibModal',
            function ($scope, $state, authService, config, $rootScope, wnwbApi, $localStorage, $sessionStorage, $uibModal) {

                console.log('MainController');

                $scope.openLexiconSelectModal = function () {
                    console.log('Select lexicon: ');
                    return $uibModal.open({
                        templateUrl: 'view/main/selectLexicon.html',
                        scope: $scope,
                        controller: 'main/selectLexiconCtrl',
                        backdrop: 'static'
                    });
                };

                $scope.setCurrentLexicon = function(lexicon) {
                    $scope.$storage.currentLexicon = lexicon;
                };

                var lexicons = wnwbApi.Lexicon.query(function () {
                    console.log(lexicons);
                    $scope.lexicons = lexicons;
                });

                $scope.$storage = $localStorage;

                if(!$scope.$storage.currentLexicon) {
                    $scope.openLexiconSelectModal();
                }

                $scope.$storage.anchor = [
                    {name: 'n:baas-1'},
                    {name: 'n:baas-2'}
                ];



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
