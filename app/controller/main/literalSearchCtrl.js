/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('main/literalSearchCtrl', ['$scope', '$state', '$uibModal', '$uibModalInstance', 'wnwbApi', 'searchType', function ($scope, $state, $uibModal, $uibModalInstance, wnwbApi, searchType) {

        console.log('main/literalSearchCtrl (searchType: '+searchType+')');

        $scope.searchTerm = '';
        $scope.searchResults = [];
        $scope.selectedLexicalEntry = null;
        $scope.senseList = [];
        $scope.selectedSense = null;
        $scope.searchType = searchType;

        $scope.doSearch = function (searchTerm) {
            var results = wnwbApi.LexicalEntry.query({prefix: searchTerm, lexid: 1}, function () {
                $scope.searchResults = results;
            });
        };

        $scope.selectLexicalEntry = function (lexicalEntry) {
            $scope.selectedLexicalEntry = lexicalEntry;
            $scope.selectedSense = null;

            if(!$scope.searchType || $scope.searchType == 'sense') {
                var senseList = wnwbApi.Sense.query({word: lexicalEntry.lemma}, function () {
                    $scope.senseList = senseList;
                });
            }
            if($scope.searchType == 'synset') {
                var senseList = wnwbApi.SynSet.query({word: lexicalEntry.lemma}, function () {
                    $scope.senseList = senseList;
                });
            }
        };

        $scope.selectSenseRow = function (sense) {
            $scope.selectedSense = sense;
        };

        $scope.cancel = function () {
            $uibModalInstance.close(null);
        };

        $scope.goToSense = function () {
            $uibModalInstance.close();
            if($scope.selectedSense) {
                $state.go('sense', {id: $scope.selectedSense.id});
            }
        };

        $scope.selectSense = function (sense) {
            $uibModalInstance.close(sense);
        };

        $scope.selectSynSet = function (synset) {
            console.log('select SynSet '+synset);
            $uibModalInstance.close(synset);
        };

        $scope.$watch('searchTerm', function (newVal, oldVal) {
            $scope.doSearch(newVal);
        });
    }]);
});