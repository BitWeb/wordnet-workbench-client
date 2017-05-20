/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'AuthService'
], function (angularAMD) {

    angularAMD.controller('AuthCtrl', ['$scope', '$state', 'AuthService','$log', function ($scope, $state, authService, $log) {
        if(authService.isAuthenticated()){
            $state.go('home');
            return;
        }

        $scope.login = function () {
            console.log($scope.myForm.username.$error);

            authService.startAuth($scope.username, $scope.password, function (data) {
                if(data.success) {
                    console.debug('login success');
                    $scope.status = {loginError: false};
                } else {
                    $scope.status = {loginError: true};
                    console.debug('login fail');
                }
            });
        };

        $scope.status = {loginError: false};
    }]);
});