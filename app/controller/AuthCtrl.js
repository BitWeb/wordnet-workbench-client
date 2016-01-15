/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'AuthService',
    'service/TestService'
], function (angularAMD) {

    angularAMD.controller('AuthCtrl', ['$scope', '$state', 'AuthService','$log', 'service/TestService', function ($scope, $state, authService, $log, testService) {

        $log.debug('Auth controller. Is authenticated: ', authService.isAuthenticated());

        testService.init();
        console.log('test a '+testService.a);

        var Car = function () {
            console.log('new car');
            this.a = 10;
        };

        var a = new Car();
        var b = new Car();
        a.a = 20;
        console.log('a '+ a.a);
        console.log('b '+ b.a);

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