/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/selectLexiconCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'service/WorkingLexiconService', function ($scope, $state, $uibModal, $uibModalInstance, workingLexiconService) {

        $scope.lexicons = workingLexiconService.getLexicons();

        $scope.selectLexicon = function (lexicon) {
            workingLexiconService.setWorkingLexicon(lexicon);
            //$scope.$storage.currentLexicon = lexicon;
            $scope.$close();
        };
    }]);
});