/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/selectLexiconCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$uibModal',
        '$uibModalInstance',
        'service/LexiconService',
        function (
            $scope,
            $rootScope,
            $state,
            $uibModal,
            $uibModalInstance,
            lexiconService
        ) {
            lexiconService.getLexicons().then(function (lexicons) {
                $scope.lexicons = lexicons;
            });

            $scope.selectLexicon = function (lexicon) {
                lexiconService.setWorkingLexicon(lexicon);
                $rootScope.$broadcast('workingLexiconChangedByUser', lexicon, $state.current);
                $scope.$close();
            };
        }
    ]);
});