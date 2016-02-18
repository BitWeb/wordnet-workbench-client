/**
 * Created by ivar on 25.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('AdminCtrl', ['$scope','$state', 'AuthService', function ($scope, $state, authService) {

        $scope.tabs = [
            { heading: "Sense relation types", route:"admin.sensereltype", active:false },
            { heading: "Synset relation types", route:"admin.synsetreltype", active:false },
            //{ heading: "External reference types", route:"admin.extreftype", active:false },
            { heading: "Domains", route:"admin.domain", active:false },
            { heading: "Sense styles", route:"admin.sensestyle", active:false }/*,
            { heading: "Users", route:"admin.user", active:false }*/
        ];

        $scope.go = function(route){
            $state.go(route);
        };

        $scope.active = function(route){
            return $state.is(route);
        };

        $scope.$on("$stateChangeSuccess", function() {
            console.log('Admin state change success');
            $scope.tabs.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });

    }]);
});