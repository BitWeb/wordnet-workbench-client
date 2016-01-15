/**
 * Created by ivar on 14.01.16.
 */

define([
    'angularAMD',
    'service/AnchorService'
], function (angularAMD) {

    angularAMD.controller('common/AnchorCtrl', ['$scope', '$state', '$timeout', 'wnwbApi', 'service/AnchorService', function ($scope, $state, $timeout, wnwbApi, AnchorService) {
        $scope.anchorList = null;

        $scope.workingAnchor = null;

        $scope.anchorChanged = function () {
            if($scope.workingAnchor.type == 'sense') {
                $state.go('sense', {id: $scope.workingAnchor.id});
            }
            if($scope.workingAnchor.type == 'synSet') {
                $state.go('synset', {id: $scope.workingAnchor.id});
            }
        };

        $scope.$on('anchorListChanged', function (event, newAnchorList, newAnchor) {
            $scope.anchorList = newAnchorList;
            $scope.workingAnchor = newAnchor;

            console.log('newAnchor');
            console.log(newAnchor);
        });

    }]);
});