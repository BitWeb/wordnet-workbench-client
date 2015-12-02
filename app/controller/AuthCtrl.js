/**
 * Created by ivar on 23.11.15.
 */

define(['angularAMD', 'UserService'], function (angularAMD) {

    angularAMD.controller('AuthCtrl', ['$scope', '$state', 'UserService','$log', function ($scope, $state, userService, $log) {

        $log.debug('Auth controller. Is authenticated: ', userService.isAuthenticated());

        if(userService.isAuthenticated()){
            $state.go('home');
            return;
        }

        $scope.startAuthentication = function () {
            userService.startAuth();
        };
    }]);
});