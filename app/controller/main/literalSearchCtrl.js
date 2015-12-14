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
        $scope.selsectedLexicalEntry = null;
        $scope.senseList = [];

        $scope.doSearch = function (searchTerm) {
            var results = wnwbApi.LexicalEntry.query({prefix: searchTerm, lexid: 1}, function () {
                $scope.searchResults = results;
            });
        };

        $scope.loadSense = function (k, senseId) {
            var sense = wnwbApi.Sense.get({id: senseId}, function () {
                $scope.senseList[k] = sense;
                console.debug(sense);
            });
        };

        $scope.selectLexicalEntry = function (lexicalEntry) {
            $scope.selsectedLexicalEntry = lexicalEntry;
            $scope.senseList = [];
            for(k in lexicalEntry.senses) {
                var senseId = lexicalEntry.senses[k];
                $scope.loadSense(k, senseId);
                /*var sense = wnwbApi.Sense.get({id: senseId}, function () {
                    $scope.senseList[k] = sense;
                    console.debug(sense);
                });*/
            }
        };

        $scope.$watch('searchTerm', function (newVal, oldVal) {
            $scope.doSearch(newVal);
        });

        /*$scope.setupOtherOptions = function () {
            $scope.otherOptions = [{id: 0, name: 'N/A'}];
            for(k in $scope.senseRelTypes) {
                if($scope.senseRelTypes[k].direction == $scope.senseRelType.direction) {
                    $scope.otherOptions.push($scope.senseRelTypes[k]);
                }
            }
        };

        $scope.$watch('senseRelType.direction', function (newVal, oldVal) {
            $scope.setupOtherOptions();
        });

        $scope.setupOtherOptions();

        $scope.save = function (form) {
            console.log('[admin/senseRelType/editCtrl] save '+$scope.senseRelType.id);

            form.submitted = true;
            if(!form.$valid){
                return;
            }
            $scope.senseRelType.$update({id: $scope.senseRelType.id}, function () {
                $modalInstance.close($scope.senseRelType);
                $scope.loadData();
            });
        };*/
    }]);
});