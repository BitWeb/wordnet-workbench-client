/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'AuthService'
], function (angularAMD) {

    angularAMD.controller('AuthCtrl', ['$scope', '$state', 'AuthService','$log', function ($scope, $state, authService, $log) {

        $log.debug('Auth controller.');

        if(authService.isAuthenticated()){
            $state.go('home');
            return;
        }

        $scope.login = function () {
            console.log($scope.myForm.username.$error);

            authService.startAuth($scope.username, $scope.password, function (data) {
                console.log('auth callback');
                if(data.success) {
                    console.log('login success');
                    $scope.status = {loginError: false};
                } else {
                    $scope.status = {loginError: true};
                    console.log('login fail');
                }
            });
        };

        $scope.status = {loginError: false};
    }]);
});