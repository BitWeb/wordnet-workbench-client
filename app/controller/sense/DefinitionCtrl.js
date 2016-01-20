/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/sense/DefinitionCtrl', ['$scope','$state', '$stateParams', '$log', 'AuthService', function ($scope, $state, $stateParams, $log, authService) {
        $log.log('controller/sense/DefinitionCtrl');

        //synset/has to be loaded

        var defId = null;
        if($stateParams.defId) {
            defId = $stateParams.defId;
        }

        $scope.getDefinition(defId).then(function (definition) {
            $log.log('Loading done');
            $log.log(definition);
        });

        $scope.tempDef = {statements: []};
        $scope.def = {};
        $scope.selectedStatement = null;
        $scope.tempStmt = {};

        $scope.addStatement = function () {
            if($scope.selectedStatement) {
                $scope.saveStatement();
            }
            var newStmt = {
                text: '',
                source: ''
            };
            $scope.tempDef.statements.push(newStmt);
            $scope.selectedStatement = newStmt;
            $scope.tempStmt = angular.copy(newStmt);
        };

        $scope.editStatement = function (statement) {
            if($scope.selectedStatement) {
                $scope.saveStatement();
            }
            $scope.tempStmt = angular.copy(statement);
            $scope.selectedStatement = statement;
        };

        $scope.saveStatement = function () {
            angular.copy($scope.tempStmt, $scope.selectedStatement);
            $scope.cancelEdit();
        };

        $scope.cancelEdit = function () {
            $scope.selectedStatement = null;
        };

        $scope.deleteStatement = function (statement) {
            var index = $scope.tempDef.statements.indexOf(statement);
            if (index > -1) {
                $scope.tempDef.statements.splice(index, 1);
            }
        };

        $scope.discardDefinition = function () {
            $state.go('^', {id: $scope.sense.id});
        };

        $scope.saveDefinition = function () {
            if($scope.tempDef.id) {
                angular.copy($scope.tempDef, $scope.def);
            } else {
                var newDef = angular.copy($scope.tempDef);
                $scope.sense.sense_definitions.push(newDef);
            }
            $state.go('^', {id: $scope.sense.id});
        };

        /*$scope.$on('sense-loaded', function (event, value) {
            if(defId) {
                for(k in $scope.sense.sense_definitions) {
                    if($scope.sense.sense_definitions[k].id == defId) {
                        $scope.def = $scope.sense.sense_definitions[k];
                        break;
                    }
                }
                $scope.tempDef = angular.copy($scope.def);
            }
        });*/

    }]);
});