/**
 * Created by ivar on 14.01.16.
 */
"use strict";

define([
    'angularAMD',
    'service/LexiconService',
    'service/AnchorService'
], function (angularAMD) {

    angularAMD.controller('common/AnchorCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$log', 'wnwbApi', 'service/LexiconService', 'service/AnchorService', function ($scope, $rootScope, $state, $timeout, $log, wnwbApi, lexiconService, anchorService) {

        $log.log('AnchorCtrl');

        $scope.workingLexicon = lexiconService.getWorkingLexicon();

        $scope.anchorList = function () {
            $log.log('Anchor list update');
            anchorService.getAnchorList($scope.workingLexicon.id);
        };

        $log.log($scope.workingLexicon);
        $log.log($scope.anchorList);

        $scope.selectedAnchor = null;

        $scope.anchorChanged = function () {
            if($scope.selectedAnchor) {
                /*if($scope.workingAnchor.type == 'sense') {
                    $state.go('sense', {id: $scope.workingAnchor.id});
                }
                if($scope.workingAnchor.type == 'synSet') {
                    $state.go('synset', {id: $scope.workingAnchor.id});
                }*/
            }
        };

        var anchorListChanged = $scope.$on('anchorListChanged', function (event, newAnchorList, newAnchor) {
            $log.log('anchorListChanged');
            $rootScope.anchorList = newAnchorList;
            $scope.anchorList = newAnchorList;
            $scope.workingAnchor = newAnchor;

            console.log('newAnchor');
            console.log(newAnchor);
        });

        var workingLexiconChanged = $scope.$on('workingLexiconChanged', function (event, workingLexicon) {
            $log.log('AnchorCtrl working lexicon changed');
            $scope.anchorList = anchorService.getAnchorList(workingLexicon.id);
        });

        $scope.$on("$destroy", function() {
            anchorListChanged();
            workingLexiconChanged();
        });

    }]);
});