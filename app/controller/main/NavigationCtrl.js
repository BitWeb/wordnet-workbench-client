define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('main/NavigationCtrl', ['$scope', '$state', 'wnwbApi', 'service/LexiconService', function ($scope, $state, wnwbApi, lexiconService) {

        $scope.workingLexicon = lexiconService.getWorkingLexicon();

        $scope.lexicons = lexiconService.getLexicons();
        $scope.lexicons.then(function (lexicons) {
            $scope.lexicons = lexicons;
        });

        $scope.setWorkingLexicon = function (lexicon) {
            lexiconService.setWorkingLexicon(lexicon);
        };

        $scope.$on('workingLexiconChanged', function (event) {
            $scope.workingLexicon = lexiconService.getWorkingLexicon();
        });

    }]);
});