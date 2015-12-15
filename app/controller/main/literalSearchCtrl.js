/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/literalSearchCtrl', ['$scope', '$state', '$uibModal', '$modalInstance', 'wnwbApi', function ($scope, $state, $uibModal, $modalInstance, wnwbApi) {

        console.log('main/literalSearchCtrl');

        $scope.searchTerm = '';
        $scope.searchResults = [];
        $scope.selectedLexicalEntry = null;
        $scope.senseList = [];
        $scope.selectedSense = null;

        $scope.doSearch = function (searchTerm) {
            var results = wnwbApi.LexicalEntry.query({prefix: searchTerm, lexid: 1}, function () {
                $scope.searchResults = results;
            });
        };

        $scope.selectLexicalEntry = function (lexicalEntry) {
            $scope.selectedLexicalEntry = lexicalEntry;
            $scope.selectedSense = null;

            var senseList = wnwbApi.Sense.query({word: lexicalEntry.lemma}, function () {
                $scope.senseList = senseList;
            });
        };

        $scope.selectSenseRow = function (sense) {
            $scope.selectedSense = sense;
        };

        $scope.cancel = function () {
            $modalInstance.close();
        };

        $scope.goToSense = function () {
            $modalInstance.close();
            if($scope.selectedSense) {
                $state.go('sense', {id: $scope.selectedSense.id});
            }
        };

        $scope.selectSense = function () {
            $modalInstance.close();
        };

        $scope.$watch('searchTerm', function (newVal, oldVal) {
            $scope.doSearch(newVal);
        });
    }]);
});