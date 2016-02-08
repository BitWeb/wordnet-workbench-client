define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('main/NavigationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log', 'wnwbApi', 'service/LexiconService', 'AuthService', function ($scope, $rootScope, $state, $stateParams, $log, wnwbApi, lexiconService, authService) {

        $scope.workingLexicon = lexiconService.getWorkingLexicon();

        $scope.lexicons = lexiconService.getLexicons();
        $scope.lexicons.then(function (lexicons) {
            $scope.lexicons = lexicons;
        });

        $scope.setWorkingLexicon = function (lexicon) {
            lexiconService.setWorkingLexicon(lexicon);
            $rootScope.$broadcast('workingLexiconChangedByUser', lexicon, $state.current);
        };

        $scope.logout = function () {
            authService.signOut();
            $state.go('home', {}, {reload: true});
        };

        $scope.$on('workingLexiconChangedByUser', function (event, lexicon, state) {
            $scope.workingLexicon = lexicon;
        });

        $scope.$on('LexiconService.workingLexiconChange', function (event, newWorkingLexicon) {
            $scope.workingLexicon = newWorkingLexicon;
        });

    }]);
});