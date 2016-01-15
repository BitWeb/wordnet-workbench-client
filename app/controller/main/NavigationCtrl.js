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
            //go to anchor of new lexicon or home if anchor is empty

            //set lexicon & go home

            lexiconService.setWorkingLexicon(lexicon);

            $state.go('home');
        };

        /*$scope.$on('workingLexiconChanged', function (event) {
            //could use rootScope

            $scope.workingLexicon = workingLexiconService.getWorkingLexicon();
        });*/

    }]);
});