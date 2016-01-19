define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('main/NavigationCtrl', ['$scope', '$rootScope', '$state', '$log', 'wnwbApi', 'service/LexiconService', function ($scope, $rootScope, $state, $log, wnwbApi, lexiconService) {

        $log.log('NavigationCtrl');

        $scope.workingLexicon = lexiconService.getWorkingLexicon();

        $scope.lexicons = lexiconService.getLexicons();
        $scope.lexicons.then(function (lexicons) {
            $scope.lexicons = lexicons;
        });

        $scope.setWorkingLexicon = function (lexicon) {
            lexiconService.setWorkingLexicon(lexicon);
            $rootScope.$broadcast('workingLexiconChangedByUser', lexicon, $state.current);
        };

        $scope.$on('workingLexiconChanged', function (event) {
            //$scope.workingLexicon = lexiconService.getWorkingLexicon();
        });

    }]);
});