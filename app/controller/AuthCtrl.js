/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'AuthService'
], function (angularAMD) {

    angularAMD.controller('AuthCtrl', ['$scope', '$state', 'AuthService','$log', function ($scope, $state, authService, $log) {

        $log.debug('Auth controller. Is authenticated: ', authService.isAuthenticated());

        //$scope.username = '';
        //$scope.password = '';

        if(authService.isAuthenticated()){
            $state.go('home');
            return;
        }

        $scope.login = function () {
            authService.startAuth($scope.username, $scope.password);
            console.log('Login: ');
            console.log($scope.username+' '+$scope.password);
        };
        /*$scope.startAuthentication = function () {
            userService.startAuth();
        };*/
    }]);
});