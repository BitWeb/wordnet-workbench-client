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

define(['appModule', 'UserService'/*, 'ErrorModalController'*/], function (app) {

    app.controller('MainCtrl',
        ['$scope', /*'$state',*/'UserService','config','$rootScope'/*,'$modal'*/,
            function ($scope, $state, UserService, config, $rootScope/*, $modal*/) {

                console.log('MainController');

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
