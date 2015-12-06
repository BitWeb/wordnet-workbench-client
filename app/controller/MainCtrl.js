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

define(['appModule', 'UserService', 'angular-storage', 'underscore'], function (app) {

    app.controller('MainCtrl',
        ['$scope', '$state', 'UserService','config','$rootScope', 'wnwbApi', '$localStorage', '$sessionStorage'/*,'$modal'*/,
            function ($scope, $state, UserService, config, $rootScope, wnwbApi, $localStorage, $sessionStorage/*, $modal*/) {

                console.log('MainController');

                var lexicons = wnwbApi.Lexicon.query(function () {
                    console.log(lexicons);
                    $scope.lexicons = lexicons;
                });

                $scope.$storage = $localStorage;

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
