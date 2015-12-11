/**
 * Created by ivar on 11.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/selectLexiconCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', function ($scope, $state, $uibModal, $modalInstance) {
        $scope.selectLexicon = function (lexicon) {
            $scope.$storage.currentLexicon = lexicon;
            $scope.$close();
        };
    }]);
});