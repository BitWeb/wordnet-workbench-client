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

        $scope.anchorList = anchorService.getAnchorList(); //Reload: lexicons not loaded
        $log.log($scope.anchorList);

        $scope.selectedAnchor = null;

        $scope.getWorkingAnchor = function () {
            return anchorService.getWorkingAnchor();
        };

        $scope.getAnchorList = function () {
            var workingLexiconId = lexiconService.getWorkingLexicon().id;
            return anchorService.getAnchorList(workingLexiconId);
        };

        $scope.$watch('anchorService.getAnchorList()', function(newValue, oldValue) {
            //$log.log('watch');
            //$log.log(newValue);
        });

        $scope.anchorChanged = function () {
            if($scope.selectedAnchor) {
                if($scope.selectedAnchor.type == 'sense') {
                    $state.go('sense', {id: $scope.selectedAnchor.id});
                }
                if($scope.selectedAnchor.type == 'synSet') {
                    $state.go('synset', {id: $scope.selectedAnchor.id});
                }
            }
        };

        var anchorListChange = $scope.$on('AnchorService.anchorListChange', function (event, newAnchorList, newWorkingAnchor) {
            //$log.log('AnchorCtrl anchorListChange');
            $scope.anchorList = newAnchorList;
            $scope.selectedAnchor = newWorkingAnchor;
        });

        var workingLexiconChange = $scope.$on('LexiconService.workingLexiconChange', function (event, newWorkingLexicon) {
            //
            $log.log('AnchorCtrl wokringLexiconChange');
        });

        $scope.$on("$destroy", function() {
            anchorListChange();
            workingLexiconChange();
        });

    }]);
});