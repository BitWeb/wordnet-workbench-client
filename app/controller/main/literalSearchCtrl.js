/**
 * Created by ivar on 1.12.15.
 */

define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.controller('main/literalSearchCtrl', ['$scope', '$state', '$log', '$uibModal', '$uibModalInstance', 'wnwbApi', 'service/LexiconService', 'searchType', 'lexiconMode', function ($scope, $state, $log, $uibModal, $uibModalInstance, wnwbApi, lexiconService, searchType, lexiconMode) {

        $log.log('main/literalSearchCtrl (searchType: '+searchType+')');

        $scope.searchTerm = '';
        $scope.searchResults = [];
        $scope.selectedLexicalEntry = null;
        $scope.senseList = [];
        $scope.selectedSense = null;
        $scope.searchType = searchType;
        $scope.lexiconMode = lexiconMode;
        $scope.selectedLexicon = {};
        $scope.lexiconList = null;
        $scope.selectedPos = 'n';

        lexiconService.getLexicons().then(function (lexiconList) {
            $scope.lexiconList = lexiconList;
            if ($scope.lexiconMode == 'any' || $scope.lexiconMode == null) {
            	$scope.selectedLexicon = lexiconService.getWorkingLexicon();
            } else {
            	$scope.selectedLexicon = lexiconService.getLexiconById($scope.lexiconMode);
            }
        });

        $scope.doSearch = function () {
            var searchTerm = $scope.searchTerm;
            var hasSynset = null;
            if($scope.searchType == 'synset') {
                hasSynset = 'true';
            }
            $log.log('main/LexicalEntry.query (prefix: '+searchTerm+', lexicon: '+$scope.selectedLexicon+ ')');
            if(searchTerm.length) {
                var results = wnwbApi.LexicalEntry.query({prefix: searchTerm, lexid: $scope.selectedLexicon.id, pos: $scope.selectedPos, has_synset: hasSynset}, function () {
                    $scope.searchResults = [];
                    for(var i = 0;i < results.length;i++) {
                        if(results[i].senses.length) {
                            $scope.searchResults.push(results[i]);
                        }
                    }
                });
            }
        };

        $scope.selectLexicalEntry = function (lexicalEntry) {
            $scope.selectedLexicalEntry = lexicalEntry;
            $scope.selectedSense = null;

            if(!$scope.searchType || $scope.searchType == 'sense') {
                var senseList = wnwbApi.Sense.query({word: lexicalEntry.lemma, lexid: $scope.selectedLexicon.id}, function () {
                    $scope.senseList = senseList;
                    if($scope.senseList.length == 1) {
                        $scope.selectSenseRow($scope.senseList[0]);
                    }
                });
            }
            if($scope.searchType == 'synset') {
                var senseList = wnwbApi.SynSet.query({word: lexicalEntry.lemma, lexid: $scope.selectedLexicon.id}, function () {
                    $scope.senseList = senseList;
                    if($scope.senseList.length == 1) {
                        $scope.selectSenseRow($scope.senseList[0]);
                    }
                });
            }
        };

        $scope.posChanged = function () {
            $scope.doSearch();
        };

        $scope.lexiconChanged = function () {
            $scope.doSearch();
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
                if($scope.selectedSense.synset) {
                    $state.go('synset', {id: $scope.selectedSense.synset});
                } else {
                    $state.go('sense', {senseId: $scope.selectedSense.id});
                }
            }
        };

        $scope.selectSense = function (sense) {
            $uibModalInstance.close(sense);
        };

        $scope.selectSynSet = function (synset) {
            $uibModalInstance.close(synset);
        };

        $scope.$watch('searchTerm', function (newVal, oldVal) {
            $scope.doSearch();
        });
    }]);
});