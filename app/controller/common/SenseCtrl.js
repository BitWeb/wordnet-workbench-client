/**
 * Created by ivar on 17.12.15.
 */

define([
    'angularAMD',
    'angular-animate'/*,
     'controller/DefCtrl'*/
], function (angularAMD) {

    angularAMD.controller('controller/common/SenseCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', '$animate', 'sense', function ($scope, $state, $stateParams, wnwbApi, $animate, sense) {
        console.log('controller/common/SenseCtrl');

        console.log(sense);
        $scope.sense = sense;

        var domains = wnwbApi.Domain.query(function () {
            $scope.domains = domains;
        });

        $scope.selectedDefinition = null;
        $scope.tempDef = {};
        $scope.selectDefinition = function (def) {
            $scope.selectedDefinition = def;
            if($scope.selectedDefinition) {
                //var index = $scope.sense.sense_definitions.indexOf($scope.selectedDefinition);
                $state.go('.def', {id: $scope.sense.id, defId: $scope.selectedDefinition.id}).then(function () {
                    $scope.$broadcast('sense-loaded', $scope.sense);
                });
            }
        };

        $scope.addDefinition = function () {
            $state.go('.def', {id: $scope.sense.id});
            $scope.selectedDefinition = {statements: []};
            $scope.$broadcast('sense-loaded', $scope.sense);
        };

        $scope.deleteDefinition = function (definition) {
            var index = $scope.sense.sense_definitions.indexOf(definition);
            if (index > -1) {
                $scope.sense.sense_definitions.splice(index, 1);
            }
        };

        $scope.addExample = function () {
            var newExample = {
                text: '',
                language: '',
                source: ''
            };
            $scope.sense.examples.push(newExample);
            $scope.selectedExample = newExample;
            $scope.tempExample = angular.copy(newExample);
        };

        $scope.tempExample = {};
        $scope.selectedExample = null;

        $scope.editExample = function (example) {
            if($scope.selectedExample) {
                $scope.saveExample();
            }
            $scope.tempExample = angular.copy(example);
            $scope.selectedExample = example;
        };

        $scope.saveExample = function () {
            angular.copy($scope.tempExample, $scope.selectedExample);
            $scope.cancelExample();
        };

        $scope.cancelExample = function () {
            $scope.selectedExample = null;
        };

        $scope.deleteExample = function (example) {
            var index = $scope.sense.examples.indexOf(example);
            if (index > -1) {
                $scope.sense.examples.splice(index, 1);
            }
        };

        $scope.showRelation = function () {

        };

        $scope.addRelation = function () {

        };

        $scope.showRelation = function () {

        };

        $scope.addExtRef = function () {

        };

        $scope.selectExtRef = function () {

        };

        $scope.showDefinition = function () {
            $scope.secondaryView = 'definition';
        };

        $scope.showRelation = function () {
            $scope.secondaryView = 'relation';
        };

        $scope.saveSense = function () {
            if($scope.sense.id) {
                $scope.sense.$update({id: $scope.sense.id});
                $state.go('^', {id: $scope.synSet.id});
            } else {
                var result = $scope.sense.$save(function () {
                    $state.go('^', {id: $scope.synSet.id});
                });
            }
        };

        $scope.discardSenseChanges = function () {

        };

    }]);
});